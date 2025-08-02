#!/bin/bash

# AI Video Creator - Quick Setup Script

echo "🎬 AI Video Creator - Setup Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your API keys!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
if [ -f .env ] && grep -q "DATABASE_URL" .env; then
    echo "🗄️  Running database migrations..."
    npm run migrate
fi

# Build CSS
echo "🎨 Building Tailwind CSS..."
npx tailwindcss -i ./src/index.css -o ./dist/output.css

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Ensure PostgreSQL is running (if using database)"
echo "3. Run 'npm run dev' to start development server"
echo "4. Run 'npm run server' to start backend server"
echo ""
echo "Or use 'npm run dev:all' to start both!"