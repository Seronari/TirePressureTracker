# Deployment Instructions for Hoster.kz

## Configuration for Hosting Provider

**Exit code 127 fix:**

### 1. Build Configuration
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Main File:** `dist/index.js`

### 2. Node.js Version
Ensure your hosting supports Node.js 18 or higher.

### 3. Environment Variables (Required)
Add these in your hosting control panel:

```
DATABASE_URL=your_database_connection_string
PGHOST=your_postgres_host
PGUSER=your_postgres_username  
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name
PGPORT=5432
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
NODE_ENV=production
```

### 4. Alternative Setup (if build fails)
If npm commands are not available:
- **Main File:** `server/index.ts`
- Ensure TypeScript runtime is available on hosting

### 5. Port Configuration
The application automatically detects the hosting provider's assigned port via `process.env.PORT`.

## Common Issues
- Exit code 127: Node.js not found or wrong version
- Port binding errors: Environment variables not configured
- Database connection: Check DATABASE_URL format