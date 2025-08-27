#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
REPO_ROOT=$(git rev-parse --show-toplevel)
TOOLS_DIR="$REPO_ROOT/.compliance-tools"
PATH="$TOOLS_DIR:$PATH"
mkdir -p "$REPO_ROOT/COMPLIANCE"

if ! command -v syft >/dev/null 2>&1; then
  echo "Syft not installed. Run install_tools.sh" >&2
  exit 1
fi

syft packages dir:"$REPO_ROOT" -o spdx-json > "$REPO_ROOT/COMPLIANCE/SBOM.spdx.json" || echo '{}' > "$REPO_ROOT/COMPLIANCE/SBOM.spdx.json"
syft packages dir:"$REPO_ROOT" -o cyclonedx-json > "$REPO_ROOT/COMPLIANCE/bom.cdx.json" || echo '{}' > "$REPO_ROOT/COMPLIANCE/bom.cdx.json"
