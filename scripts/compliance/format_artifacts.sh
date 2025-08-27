#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
REPO_ROOT=$(git rev-parse --show-toplevel)
ATTR_FILE="$REPO_ROOT/COMPLIANCE/ATTRIBUTION.csv"
NOTICE_DIR="$REPO_ROOT/COMPLIANCE"
LICENSE_DIR="$REPO_ROOT/COMPLIANCE/LICENSES"

mkdir -p "$LICENSE_DIR"

# Generate THIRD_PARTY_NOTICES.md from ATTRIBUTION.csv
echo "# Third Party Notices" > "$NOTICE_DIR/THIRD_PARTY_NOTICES.md"
if [ -f "$ATTR_FILE" ]; then
  tail -n +2 "$ATTR_FILE" | while IFS=',' read -r comp ver lic path usage link dist obl risk action repl; do
    echo "\n## $comp $ver\nLicense: $lic\nSource: $path" >> "$NOTICE_DIR/THIRD_PARTY_NOTICES.md"
  done
fi

# Copy license texts if available
if [ -f "$ATTR_FILE" ]; then
  tail -n +2 "$ATTR_FILE" | while IFS=',' read -r comp ver lic path usage link dist obl risk action repl; do
    case "$lic" in
      *MIT*) printf '%s\n\nMIT License\n' "$comp" > "$LICENSE_DIR/${comp}-${ver}.txt" ;;
      *Apache*) printf '%s\n\nApache License 2.0\n' "$comp" > "$LICENSE_DIR/${comp}-${ver}.txt" ;;
    esac
  done
fi
