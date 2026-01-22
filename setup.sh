#!/bin/bash

# SPK Creator - Quick Setup Script

echo "🚀 SPK Creator Setup"
echo "===================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ .env.local created. Please edit it with your Supabase credentials."
    echo ""
else
    echo "✓ .env.local already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Edit .env.local with your Supabase credentials"
    echo "2. Run the database migration (database/schema.sql) in Supabase SQL Editor"
    echo "3. Start the dev server: npm run dev"
    echo ""
    echo "📖 See README.md for detailed instructions"
else
    echo ""
    echo "❌ Installation failed. Try:"
    echo "   npm cache clean --force"
    echo "   npm install --legacy-peer-deps"
    echo ""
    echo "See README.md for troubleshooting tips"
fi
