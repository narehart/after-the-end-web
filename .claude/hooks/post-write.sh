#!/bin/bash
# Post-write hook for Claude Code
# Runs after Write or Edit tool completes

# Extract file path from JSON input via stdin
file_path=$(jq -r '.tool_input.file_path')

# Run ESLint on JavaScript/TypeScript files
if [[ "$file_path" =~ \.(js|jsx|ts|tsx)$ ]]; then
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    output=$(./node_modules/.bin/eslint --fix "$file_path" 2>&1)
    exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        echo "$output" >&2
        exit 2
    fi
fi

exit 0
