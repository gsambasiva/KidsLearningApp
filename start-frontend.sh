#!/bin/bash
# SmartKids Frontend Startup Script
# Run this in Terminal 2 (after backend is running)

echo "╔══════════════════════════════════════════╗"
echo "║   SmartKids Frontend - Starting...       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📱 Install 'Expo Go' on your phone to test the app"
echo "🔗 Backend should be running at http://localhost:5001"
echo ""
echo "⚠️  If testing on a physical device, update your IP:"
echo "   Edit frontend/.env → replace localhost with your machine's IP"
echo "   (use: ipconfig on Windows / ifconfig on Mac/Linux)"
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

echo "🚀 Starting Expo server..."
npx expo start
