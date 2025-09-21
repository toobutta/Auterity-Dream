#!/bin/bash
# Run API tests

echo "🧪 Running API tests..."
cd services/api

# Check if pytest is installed
if ! python3 -c "import pytest" 2>/dev/null; then
    echo "⚠️  pytest not installed. Installing..."
    pip3 install pytest
fi

python3 -m pytest tests/ -v
echo "✅ API tests complete"
