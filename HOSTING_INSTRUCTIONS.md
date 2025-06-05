# Exact Steps for Hoster.kz Deployment

## Current Problem
Your server is trying to run `dist/index.js` which doesn't exist because the build failed due to Node.js version incompatibility.

## Solution
Use the legacy deployment package instead of the main project.

## Step-by-Step Instructions

### 1. On Hoster.kz Server
```bash
# Navigate to your website directory
cd /var/www/vhosts/farsensor.kz/httpdocs/

# Remove the failed build attempt
rm -rf dist/
rm -rf node_modules/

# Upload ONLY these files from the deploy/ directory:
# - server.js
# - package.json  
# - client/ (entire directory)
# - shared/ (entire directory)
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
# Instead of npm run start, use:
node server.js

# Or if you need to specify port:
PORT=3000 node server.js
```

### 4. For Background Process
```bash
# Use PM2 or nohup to keep running:
nohup node server.js > server.log 2>&1 &

# Or with PM2:
npm install -g pm2
pm2 start server.js --name farsensor
```

## Key Differences
- No build process required
- Uses CommonJS (compatible with older Node.js)
- Minimal dependencies
- Serves static files directly

## Verification
Once running, your website should be accessible at:
- http://farsensor.kz (main site)
- http://farsensor.kz/admin (admin panel)

Admin credentials: admin/admin123