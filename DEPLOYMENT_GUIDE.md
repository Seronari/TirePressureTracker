# Farsensor Website Deployment Guide for Legacy Hosting

## Problem Identified
Your Hoster.kz server runs an older Node.js version that doesn't support:
- ES6 import/export syntax
- Modern build tools like Vite
- Node.js modules syntax (`node:perf_hooks`)

## Solution: Legacy-Compatible Deployment

### Step 1: Prepare Legacy Server
I've created `server-legacy.js` - a CommonJS-compatible server that works with older Node.js versions.

### Step 2: Deployment Package
Run the deployment script to create a hosting-ready package:

```bash
chmod +x deploy.sh
./deploy.sh
```

This creates a `deploy/` directory with:
- `server.js` (legacy-compatible server)
- `client/` (your React frontend)
- `package.json` (minimal production dependencies)

### Step 3: Upload to Hosting
1. Upload contents of `deploy/` directory to your Hoster.kz public_html
2. Install dependencies: `npm install`
3. Start server: `npm start`

### Step 4: Server Configuration
For Hoster.kz, you'll need:
- Node.js hosting plan
- Port configuration (usually 3000 or 8080)
- Environment variables if needed

### Features Included in Legacy Version
- Customer inquiry forms
- In-memory data storage
- Admin authentication
- Session management
- Static file serving
- API endpoints for frontend

### Admin Access
- Username: admin
- Password: admin123

### Environment Variables (Optional)
```
PORT=3000
SESSION_SECRET=your-secret-key
```

### Database Migration (Future)
Once your MySQL connection is working, you can:
1. Update the storage class in `server-legacy.js`
2. Add database connection code
3. Migrate from in-memory to persistent storage

This deployment bypasses all build issues and provides a working website immediately.