#!/bin/bash

set -e

echo "Running integration tests..."

# Backend integration tests
if [ -d "backend" ]; then
    echo "Running backend integration tests..."
    cd backend
    python -m pytest tests/integration/ -v --tb=short
    cd ..
fi

# Frontend integration tests
if [ -d "frontend" ]; then
    echo "Running frontend integration tests..."
    cd frontend
    npm test -- --run --reporter=verbose
    cd ..
fi

echo "Integration tests completed"
