#!/bin/bash
# SmartKids Backend Startup Script
# Run this in Terminal 1

echo "╔══════════════════════════════════════════╗"
echo "║   SmartKids Backend - Starting...        ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "⚠️  Make sure MongoDB is running before starting!"
echo "   Local:  mongod --dbpath /data/db"
echo "   Atlas:  Set MONGODB_URI in backend/.env"
echo ""

cd "$(dirname "$0")/backend"

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install
fi

echo "🚀 Starting backend server..."
npm run dev
