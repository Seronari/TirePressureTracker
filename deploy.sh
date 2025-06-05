#!/bin/bash
set -e

echo "Deploying Farsensor website for legacy Node.js hosting..."

# Create deployment directory
mkdir -p deploy

# Copy essential files
echo "Copying application files..."
cp -r client deploy/
cp -r shared deploy/
cp server-legacy.js deploy/server.js
cp package.json deploy/

# Create simple package.json for production
cat > deploy/package.json << EOF
{
  "name": "farsensor-website",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.0.0"
  }
}
EOF

echo "Deployment package created in ./deploy directory"
echo "Upload the contents of ./deploy to your hosting server"
echo "Run 'npm install && npm start' on your server"