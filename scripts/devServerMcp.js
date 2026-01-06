#!/usr/bin/env node

/**
 * Dev Server MCP
 *
 * MCP server for controlling the Vite dev server.
 * Provides tools: dev_start, dev_stop, dev_status, dev_logs
 */

import { spawn } from 'child_process';
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

// Check if a process is running
function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// Load state from file
function loadState() {
  if (!existsSync(STATE_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    if (data.pid && isProcessRunning(data.pid)) {
      return data;
    }
    // Process no longer running, clean up
    clearState();
    return null;
  } catch {
    return null;
  }
}

// Save state to file
function saveState(pid, port, cwd) {
  const data = {
    pid,
    port,
    cwd,
    startedAt: new Date().toISOString(),
  };
  writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}

// Clear state file
function clearState() {
  if (existsSync(STATE_FILE)) {
    unlinkSync(STATE_FILE);
  }
}

// Start dev server
function handleStart(port = DEFAULT_PORT) {
  const existingState = loadState();
  if (existingState) {
    return {
      error: `Dev server already running (PID: ${existingState.pid}, port: ${existingState.port})`,
    };
  }

  const cwd = process.cwd();
  logs = [];

  devProcess = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  devProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    logs.push(...lines);
    if (logs.length > LOG_LIMIT) {
      logs = logs.slice(-LOG_LIMIT);
    }
  });

  devProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    logs.push(...lines);
    if (logs.length > LOG_LIMIT) {
      logs = logs.slice(-LOG_LIMIT);
    }
  });

  devProcess.on('close', () => {
    devProcess = null;
    clearState();
  });

  devProcess.unref();

  const pid = devProcess.pid;
  saveState(pid, port, cwd);

  return {
    pid,
    port,
    url: `http://localhost:${port}`,
    message: 'Dev server started',
  };
}

// Stop dev server
function handleStop() {
  const state = loadState();

  if (!state) {
    // Also check in-memory process
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

  try {
    // Kill the process group to ensure child processes are also killed
    process.kill(-state.pid, 'SIGTERM');
  } catch {
    try {
      process.kill(state.pid, 'SIGTERM');
    } catch {
      // Process may have already exited
    }
  }

  clearState();
  devProcess = null;
  logs = [];

  return { stopped: true, message: `Dev server stopped (was PID: ${state.pid})` };
}

// Get status
function handleStatus() {
  const state = loadState();

  if (!state) {
    return { running: false };
  }

  return {
    running: true,
    pid: state.pid,
    port: state.port,
    url: `http://localhost:${state.port}`,
    startedAt: state.startedAt,
    cwd: state.cwd,
  };
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

// Create MCP server
const server = new Server(
  {
    name: 'dev-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'dev_start',
        description: 'Start the Vite dev server',
        inputSchema: {
          type: 'object',
          properties: {
            port: {
              type: 'number',
              description: `Port to run on (default: ${DEFAULT_PORT})`,
            },
          },
        },
      },
      {
        name: 'dev_stop',
        description: 'Stop the running dev server',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'dev_status',
        description: 'Check if dev server is running',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'dev_logs',
        description: 'Get recent logs from the dev server',
        inputSchema: {
          type: 'object',
          properties: {
            lines: {
              type: 'number',
              description: 'Number of lines to return (default: 50)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  let result;

  switch (name) {
    case 'dev_start':
      result = handleStart(args?.port);
      break;
    case 'dev_stop':
      result = handleStop();
      break;
    case 'dev_status':
      result = handleStatus();
      break;
    case 'dev_logs':
      result = handleLogs(args?.lines);
      break;
    default:
      result = { error: `Unknown tool: ${name}` };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
