#!/usr/bin/env bash
set -euo pipefail

# Project root directory
FILE_PATH=$(dirname "$0")
cd "$FILE_PATH/../" || exit

echo "🧹 Clean start"
echo "🧹 Working directory: $(pwd)"

##############################################################################
##
##  bun (node_modules)
##
##############################################################################
echo ""
echo "🧹 bun clean: Start"
if type bun >/dev/null 2>&1; then
  # package.json の clean スクリプト (git clean -xdf node_modules) を再利用。
  if bun run clean; then
    echo "✅ bun clean: Success"
  else
    echo "🚫 bun clean: Failed"
  fi
else
  echo "⚠️ bun clean: Skip bun because it could not be found."
fi

##############################################################################
##
##  Finish
##
##############################################################################
echo ""
echo "🧹 Clean finished"
