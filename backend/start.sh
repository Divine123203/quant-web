#!/bin/bash
set -e

# Ensure current directory is in PYTHONPATH
export PYTHONPATH=$PYTHONPATH:.

echo "--- STARTING SYSTEM SETUP ---"
echo "Running database tables creation..."
python -m scripts.create_tables

echo "Running user seeding..."
python -m scripts.seed_user

echo "--- SETUP COMPLETE ---"
echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
