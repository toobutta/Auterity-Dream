#!/bin/sh
# SPDX-License-Identifier: MIT
set -e
# Pinned versions
SYFT_VERSION=0.103.0
TRIVY_VERSION=0.48.0
SCANCODE_VERSION=32.0.0

OS=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
INSTALL_DIR="$(pwd)/.compliance-tools"
mkdir -p "$INSTALL_DIR"

# Install Syft
if [ ! -x "$INSTALL_DIR/syft" ]; then
  echo "Installing Syft $SYFT_VERSION" >&2
  curl -sfL "https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_${OS}_${ARCH}.tar.gz" | tar -xz -C "$INSTALL_DIR" syft || echo "WARNING: Syft install failed"
fi

# Install Trivy
if [ ! -x "$INSTALL_DIR/trivy" ]; then
  echo "Installing Trivy $TRIVY_VERSION" >&2
  curl -sfL "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_${OS}-${ARCH}.tar.gz" | tar -xz -C "$INSTALL_DIR" trivy || echo "WARNING: Trivy install failed"
fi

# Install ScanCode Toolkit
if [ ! -d "$INSTALL_DIR/scancode-toolkit" ]; then
  echo "Installing ScanCode Toolkit $SCANCODE_VERSION" >&2
  curl -sfL "https://github.com/nexB/scancode-toolkit/releases/download/v${SCANCODE_VERSION}/scancode-toolkit-${SCANCODE_VERSION}.zip" -o /tmp/scancode.zip && \
    unzip -q /tmp/scancode.zip -d "$INSTALL_DIR" && \
    rm /tmp/scancode.zip || echo "WARNING: ScanCode install failed"
fi

echo "Add $INSTALL_DIR to PATH"
export PATH="$INSTALL_DIR:$PATH"
