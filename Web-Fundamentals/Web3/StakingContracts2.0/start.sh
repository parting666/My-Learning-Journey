#!/bin/bash

# Quick Start Script for Staking DApp

echo "🚀 Starting Staking DApp..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing contract dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if Hardhat node is running
if ! lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Hardhat node is not running!"
    echo "Please start it in a separate terminal with: npm run node"
    echo ""
    read -p "Press enter to continue once the node is running..."
fi

# Deploy contracts
echo ""
echo "📝 Deploying contracts..."
npm run deploy:localhost

# Start frontend
echo ""
echo "✅ Deployment complete!"
echo "🌐 Starting frontend..."
echo ""
cd frontend && npm run dev
