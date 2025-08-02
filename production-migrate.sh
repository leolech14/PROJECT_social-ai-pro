#!/bin/bash
# Production migration script

echo "🚀 Running production migrations..."

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide DATABASE_URL as first argument"
    echo "Usage: ./production-migrate.sh 'postgresql://user:pass@host:port/db'"
    exit 1
fi

# Export the DATABASE_URL
export DATABASE_URL="$1"

# Run migrations
npm run migrate

echo "✅ Migrations completed!"