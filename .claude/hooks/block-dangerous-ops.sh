#!/bin/bash
# PreToolUse hook — blocks dangerous Bash commands before they run.
# Outputs JSON with permissionDecision: "deny" to stdout (exit 0) to block.
# Exits 0 with no output to allow.

COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -qiE 'rm\s+-rf|--force|force\s+push'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Dangerous operation requires explicit approval"
    }
  }'
else
  exit 0
fi
