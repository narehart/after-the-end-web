#!/bin/bash
# Post-write hook for Claude Code
# Runs after Write or Edit tool completes

file_path=$(jq -r '.tool_input.file_path')
cd "$CLAUDE_PROJECT_DIR" || exit 0

run_check() {
    output=$("$@" 2>&1)
    if [[ $? -ne 0 ]]; then
        echo "$output" >&2
        exit 2
    fi
}

# Run Prettier on supported files
case "$file_path" in
    *.js|*.jsx|*.ts|*.tsx|*.css|*.md)
        run_check ./node_modules/.bin/prettier --write "$file_path"
        ;;
esac

# Run linters after formatting
case "$file_path" in
    *.js|*.jsx|*.ts|*.tsx) run_check ./node_modules/.bin/eslint --fix "$file_path" ;;
    *.css)                 run_check ./node_modules/.bin/stylelint --fix "$file_path" ;;
esac

exit 0
