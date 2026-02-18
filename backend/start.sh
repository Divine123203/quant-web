#!/bin/bash
set -e

# Ensure current directory is in PYTHONPATH
export PYTHONPATH=$PYTHONPATH:.

echo "--- STARTING SYSTEM SETUP ---"
date
echo "Current Directory: $(pwd)"

echo "Step 1: Creating database tables..."
python -m scripts.create_tables || echo "Table creation failed, but continuing..."

echo "Step 2: Checking/Seeding admin user..."
python -m scripts.seed_user || echo "Seeding failed, but continuing..."

echo "--- SETUP COMPLETE ---"
echo "Starting FastAPI server on port 8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
