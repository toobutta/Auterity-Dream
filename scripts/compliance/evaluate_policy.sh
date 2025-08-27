#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
REPO_ROOT=$(git rev-parse --show-toplevel)
POLICY_FILE="$REPO_ROOT/COMPLIANCE/POLICY.yml"
SCAN_FILE="$REPO_ROOT/COMPLIANCE/scancode.json"

if [ ! -f "$POLICY_FILE" ] || [ ! -f "$SCAN_FILE" ]; then
  echo "Policy or scan results missing" >&2
  exit 1
fi

# Fail on AGPL or GPL licenses
if grep -qi 'AGPL' "$SCAN_FILE" || grep -qi 'GPL-3' "$SCAN_FILE"; then
  echo "High risk license detected (AGPL/GPL)" >&2
  exit 2
fi

echo "License scan passed policy"
