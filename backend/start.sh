#!/bin/bash

# Exit on error
set -e

echo "Running database migrations..."
python -m scripts.create_tables

echo "Seeding initial user..."
python -m scripts.seed_user

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
