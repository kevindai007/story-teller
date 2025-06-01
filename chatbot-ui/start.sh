#!/bin/bash

# Script to start the React chatbot application
# Run this script to start the development server

echo "🚀 Starting AI Storyteller Chatbot..."
echo "📍 Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the my-app directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔧 Starting development server..."
echo "🌐 Open http://localhost:3000 in your browser"
echo "🔌 Make sure your backend is running on http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
