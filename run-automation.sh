#!/bin/bash

echo "🎭 Retool GUI Automation Runner"
echo "=============================="
echo

# Check for .env file
if [ ! -f ".env.playwright" ]; then
    echo "❌ Error: .env.playwright not found"
    echo "Please create it with your Retool credentials"
    exit 1
fi

# Options
echo "Select mode:"
echo "1) Run with UI (watch it happen)"
echo "2) Run headless (faster)"
echo "3) Record new actions"
echo "4) Debug mode (super slow)"
echo

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        HEADLESS=false SLOW_MO=100 node retool-gui-automator.js
        ;;
    2)
        HEADLESS=true SLOW_MO=0 node retool-gui-automator.js
        ;;
    3)
        npx playwright codegen https://retool.com
        ;;
    4)
        HEADLESS=false SLOW_MO=500 node retool-gui-automator.js
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
