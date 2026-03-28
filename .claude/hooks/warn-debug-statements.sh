#!/bin/bash
# PostToolUse hook — warns when debug statements are written to a file.
# Always exits 0 (warning only, does not block).

CONTENT=$(jq -r '.tool_input.new_string // .tool_input.content // empty')

if echo "$CONTENT" | grep -qE 'debugger|console\.log'; then
  echo "WARNING: Debug statement detected. Remove before commit."
fi

exit 0
