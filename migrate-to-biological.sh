#!/bin/bash

# 🧬 BIOLOGICAL ARCHITECTURE MIGRATION
# Automatically organize files by biological function

echo "🧬 Migrating to biological architecture..."

# Create biological directories if they don't exist
mkdir -p brain heart lungs skin liver muscle consciousness

# Suggest file migrations based on patterns
echo "📋 File migration suggestions:"

# Brain files (AI, intelligence, algorithms)
find . -maxdepth 2 -name "*ai*" -o -name "*intelligence*" -o -name "*algorithm*" -o -name "*ml*" 2>/dev/null | head -5 | while read file; do
    echo "🧠 $file → brain/"
done

# Heart files (business logic, core models)
find . -maxdepth 2 -name "*model*" -o -name "*business*" -o -name "*core*" -o -name "*logic*" 2>/dev/null | head -5 | while read file; do
    echo "❤️ $file → heart/"
done

# Lungs files (APIs, services, communication)
find . -maxdepth 2 -name "*api*" -o -name "*service*" -o -name "*client*" -o -name "*request*" 2>/dev/null | head -5 | while read file; do
    echo "🫁 $file → lungs/"
done

# Skin files (UI, components, views)
find . -maxdepth 2 -name "*ui*" -o -name "*view*" -o -name "*component*" -o -name "*interface*" 2>/dev/null | head -5 | while read file; do
    echo "🌊 $file → skin/"
done

# Liver files (data, database, processing)
find . -maxdepth 2 -name "*data*" -o -name "*db*" -o -name "*database*" -o -name "*process*" 2>/dev/null | head -5 | while read file; do
    echo "🍀 $file → liver/"
done

# Muscle files (infrastructure, build, deployment)
find . -maxdepth 2 -name "*build*" -o -name "*deploy*" -o -name "*config*" -o -name "*infra*" 2>/dev/null | head -5 | while read file; do
    echo "💪 $file → muscle/"
done

echo ""
echo "Run with --execute to perform the migration"
