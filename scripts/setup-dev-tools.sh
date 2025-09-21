#!/bin/bash
# Setup development tools for AutoMatrix AI Hub

echo "🔧 Setting up development tools..."

# Backend Python tools
echo "📦 Installing Python development tools..."
pip3 install black flake8 isort pytest

# Check if requirements.txt exists and install API service dependencies
if [ -f "services/api/requirements.txt" ]; then
    echo "📦 Installing API service dependencies..."
    pip3 install -r services/api/requirements.txt
else
    echo "⚠️  services/api/requirements.txt not found"
fi

# Frontend tools
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Install TypeScript if not present
if ! npx tsc --version &> /dev/null; then
    echo "📦 Installing TypeScript..."
    npm install --save-dev typescript
fi

cd ..

echo "✅ Development tools setup complete!"
echo ""
echo "🚀 You can now run:"
echo "   ./scripts/format-code.sh    - Format Python code"
echo "   ./scripts/run-tests.sh      - Run API tests"
echo "   ./scripts/deploy-check.sh   - Full deployment check"
