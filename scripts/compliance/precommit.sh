#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
# Ensure SPDX headers
FILES=$(git diff --cached --name-only | grep -E '\.(py|js|ts|tsx|sh)$' || true)
if [ -n "$FILES" ]; then
  MISSING=$(echo "$FILES" | xargs grep -L "SPDX-License-Identifier" || true)
  if [ -n "$MISSING" ]; then
    echo "Missing SPDX headers in:\n$MISSING" >&2
    exit 1
  fi
fi
# Basic GPL detection in staged dependency files
if git diff --cached | grep -iE 'AGPL|GPL'; then
  echo "Potential forbidden license reference detected" >&2
  exit 1
fi
exit 0
