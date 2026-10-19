#!/usr/bin/env bash
set -euo pipefail

# Project root directory
FILE_PATH=$(dirname "$0")
cd "$FILE_PATH/../" || exit

echo "🚀 Bootstrap start"
echo "🚀 Working directory: $(pwd)"

##############################################################################
##
##  mise
##
##############################################################################
echo ""
echo "🚀 mise install: Start"
if type mise >/dev/null 2>&1; then
  if mise install; then
    echo "✅ mise install: Success"
  else
    echo "🚫 mise install: Failed"
  fi
else
  echo "⚠️ mise install: Skip mise because it could not be found."
  echo "⚠️ mise install: See https://mise.jdx.dev/getting-started.html for installation."
fi

##############################################################################
##
##  bun
##
##############################################################################
echo ""
echo "🚀 bun install: Start"
if type bun >/dev/null 2>&1; then
  if bun install; then
    echo "✅ bun install: Success"
  else
    echo "🚫 bun install: Failed"
  fi
else
  echo "⚠️ bun install: Skip bun because it could not be found."
  echo "⚠️ bun install: This may be due to the fact that the mise installation has not been completed."
fi

##############################################################################
##
##  git hooks (core.hooksPath -> .githooks)
##
##############################################################################
echo ""
echo "🚀 git hooks: Start"
if type git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if bunx lefthook install; then
    echo "✅ git hooks: lefthook installed"
  else
    echo "🚫 git hooks: lefthook install failed"
  fi
else
  echo "⚠️ git hooks: Skip git hooks because this is not a git work tree or git is missing."
fi

##############################################################################
##
##  .env
##
##############################################################################
echo ""
echo "🚀 .env: Start"
if [ -f .env ]; then
  echo "⚠️ .env: Skip because .env already exists."
else
  if [ -f .env.template ]; then
    cp .env.template .env
    echo "✅ .env: Copied from .env.template"
    echo "⚠️ .env: Set PUBLIC_TURNSTILE_SITE_KEY for production-like checks."
  else
    echo "🚫 .env: .env.template not found"
  fi
fi

##############################################################################
##
##  Finish
##
##############################################################################
echo ""
echo "🚀 Bootstrap finished"
