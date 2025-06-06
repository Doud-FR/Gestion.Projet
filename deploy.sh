#!/bin/bash

# Build backend
echo "Building backend..."
npm run build

# Run database migrations
echo "Running database migrations..."
npm run prisma:migrate

# Build frontend
echo "Building frontend..."
cd client
npm run build
cd ..

# Start production server
echo "Starting production server..."
NODE_ENV=production npm start
