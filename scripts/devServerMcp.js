#!/usr/bin/env node
// Dev Server MCP - Controls Vite dev server via MCP tools

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const STATE_FILE = join(homedir(), '.claude-dev-server.json');
const LOG_LIMIT = 200;
const DEFAULT_PORT = 5173;

let devProcess = null;
let logs = [];

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function getProcessOnPort(port) {
  try {
    const output = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' });
    const pid = parseInt(output.trim().split('\n')[0], 10);
    return isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

function isTauriAppRunning() {
  try {
    // Match the Tauri app binary (target/debug/app or after-the-end)
    const output = execSync(
      `pgrep -f "target/debug/app|target/release/app|after-the-end" 2>/dev/null || true`,
      {
        encoding: 'utf-8',
      }
    );
    return output.trim().length > 0;
  } catch {
    return false;
  }
}

function killTauriProcesses(port) {
  try {
    execSync(`lsof -ti :${port} | xargs kill -9 2>/dev/null || true`, { encoding: 'utf-8' });
    // Kill Tauri app binary (target/debug/app or target/release/app or after-the-end)
    execSync(
      `pkill -9 -f "target/debug/app|target/release/app|after-the-end" 2>/dev/null || true`,
      { encoding: 'utf-8' }
    );
  } catch {
    /* ignore */
  }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    if (data.mode === 'tauri') {
      const portPid = getProcessOnPort(data.port);
      const tauriRunning = isTauriAppRunning();
      if (portPid || tauriRunning)
        return { ...data, pid: portPid || data.pid, tauriAppRunning: tauriRunning };
      clearState();
      return null;
    }
    if (data.pid && isProcessRunning(data.pid)) return data;
    clearState();
    return null;
  } catch {
    return null;
  }
}

function saveState(pid, port, cwd, mode = 'vite') {
  writeFileSync(
    STATE_FILE,
    JSON.stringify({ pid, port, cwd, mode, startedAt: new Date().toISOString() }, null, 2)
  );
}

function clearState() {
  if (existsSync(STATE_FILE)) unlinkSync(STATE_FILE);
}

function handleStart(port = DEFAULT_PORT, tauri = false) {
  const existingState = loadState();
  if (existingState)
    return {
      error: `Dev server already running (PID: ${existingState.pid}, port: ${existingState.port}, mode: ${existingState.mode || 'vite'})`,
    };
  const existingPid = getProcessOnPort(port);
  if (existingPid) return { error: `Port ${port} in use by PID ${existingPid}. Stop it first.` };
  if (tauri && isTauriAppRunning())
    return { error: 'Tauri app already running. Close it or use dev_stop.' };

  const cwd = process.cwd();
  logs = [];
  const args = tauri ? ['run', 'tauri:dev'] : ['run', 'dev', '--', '--port', String(port)];
  devProcess = spawn('npm', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true });

  const addLogs = (data) => {
    logs.push(...data.toString().split('\n').filter(Boolean));
    if (logs.length > LOG_LIMIT) logs = logs.slice(-LOG_LIMIT);
  };
  devProcess.stdout.on('data', addLogs);
  devProcess.stderr.on('data', addLogs);
  devProcess.on('close', () => {
    devProcess = null;
    clearState();
  });
  devProcess.unref();

  const mode = tauri ? 'tauri' : 'vite';
  saveState(devProcess.pid, port, cwd, mode);
  return {
    pid: devProcess.pid,
    port,
    mode,
    url: `http://localhost:${port}`,
    message: `Dev server started (${mode} mode)`,
  };
}

function handleStop() {
  const state = loadState();
  if (!state) {
    if (devProcess) {
      try {
        process.kill(devProcess.pid, 'SIGTERM');
        devProcess = null;
        return { stopped: true, message: 'Dev server stopped' };
      } catch {
        return { stopped: false, message: 'Failed to stop dev server' };
      }
    }
    return { stopped: false, message: 'No dev server running' };
  }
  if (state.mode === 'tauri') killTauriProcesses(state.port);
  else {
    try {
      process.kill(-state.pid, 'SIGTERM');
    } catch {
      try {
        process.kill(state.pid, 'SIGTERM');
      } catch {
        /* */
      }
    }
  }
  clearState();
  devProcess = null;
  logs = [];
  return {
    stopped: true,
    message: `Dev server stopped (was PID: ${state.pid}, mode: ${state.mode || 'vite'})`,
  };
}

// Get status
function handleStatus() {
  const state = loadState();
  if (state) {
    return {
      running: true,
      pid: state.pid,
      port: state.port,
      mode: state.mode || 'vite',
      url: `http://localhost:${state.port}`,
      startedAt: state.startedAt,
      cwd: state.cwd,
    };
  }
  // Check if something is running on default port even without state
  const pid = getProcessOnPort(DEFAULT_PORT);
  if (pid) {
    return {
      running: true,
      pid,
      port: DEFAULT_PORT,
      url: `http://localhost:${DEFAULT_PORT}`,
      untracked: true,
      message: 'Found untracked process on port',
    };
  }
  return { running: false };
}

// Get logs
function handleLogs(lines = 50) {
  const state = loadState();

  if (!state && !devProcess) {
    return { logs: [], message: 'No dev server running' };
  }

  const recentLogs = logs.slice(-lines);
  return { logs: recentLogs, count: recentLogs.length };
}

const EMPTY_SCHEMA = { type: 'object', properties: {} };
const tools = [
  {
    name: 'dev_start',
    description: 'Start the dev server (Vite or Tauri)',
    inputSchema: {
      type: 'object',
      properties: {
        port: { type: 'number', description: `Port (default: ${DEFAULT_PORT})` },
        tauri: { type: 'boolean', description: 'Run in Tauri mode (native window)' },
      },
    },
  },
  { name: 'dev_stop', description: 'Stop the running dev server', inputSchema: EMPTY_SCHEMA },
  { name: 'dev_status', description: 'Check if dev server is running', inputSchema: EMPTY_SCHEMA },
  {
    name: 'dev_logs',
    description: 'Get recent logs from the dev server',
    inputSchema: {
      type: 'object',
      properties: { lines: { type: 'number', description: 'Lines to return (default: 50)' } },
    },
  },
];

const handlers = {
  dev_start: (a) => handleStart(a?.port, a?.tauri),
  dev_stop: () => handleStop(),
  dev_status: () => handleStatus(),
  dev_logs: (a) => handleLogs(a?.lines),
};

const server = new Server(
  { name: 'dev-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const result = handlers[name] ? handlers[name](args) : { error: `Unknown tool: ${name}` };
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
