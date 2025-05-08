#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Install type definitions
npm install --save-dev @types/node @types/express @types/jest @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/winston @types/dotenv @types/express-validator

# Build the project
npm run build 