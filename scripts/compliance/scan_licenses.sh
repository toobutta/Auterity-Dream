#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
REPO_ROOT=$(git rev-parse --show-toplevel)
TOOLS_DIR="$REPO_ROOT/.compliance-tools"
PATH="$TOOLS_DIR:$PATH"
mkdir -p "$REPO_ROOT/COMPLIANCE"

if ! [ -d "$TOOLS_DIR/scancode-toolkit" ]; then
  echo "ScanCode not installed. Run install_tools.sh" >&2
  exit 1
fi

"$TOOLS_DIR/scancode-toolkit/scancode" --format json-pp --license --copyright --info "$REPO_ROOT" > "$REPO_ROOT/COMPLIANCE/scancode.json" || echo '{}' > "$REPO_ROOT/COMPLIANCE/scancode.json"
