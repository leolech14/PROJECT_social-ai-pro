#!/bin/bash
# Load environment variables and start server

# Export all variables from .env file
export $(cat .env | grep -v '^#' | xargs)

# Start the server
node server.js