# Farsensor - TPMS Sensors Website

Professional TPMS sensors and tire pressure monitoring systems website for Farsensor company.

## Features

- **Bilingual Support**: Russian and Kazakh languages with smooth switching
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Contact Form**: Inquiry submission with backend API
- **Product Showcase**: Universal sensors (7500₸), OEM sensors (15000₸), programmers
- **Services**: Installation (from 2000₸), battery replacement (5000₸)
- **Analytics**: Visit tracking and inquiry management
- **SEO Optimized**: Proper meta tags and Open Graph support

## Quick Start

### Option 1: Simple Deployment (Recommended for hosting providers)

1. Copy these files to your server:
   - `app.js` (main server file)
   - `public/` directory (contains all frontend files)
   - `package-simple.json` (rename to `package.json`)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Website will be available at `http://localhost:3000`

### Option 2: For Vercel Deployment

1. Use the existing `vercel.json` configuration
2. Deploy directly from your Git repository
3. Vercel will automatically build and deploy

## File Structure

```
farsensor-website/
├── app.js                 # Simple Express server
├── public/
│   ├── index.html        # Main website
│   ├── js/main.js        # JavaScript functionality
│   └── images/           # Website images
├── package-simple.json   # Minimal dependencies
└── vercel.json          # Vercel deployment config
```

## API Endpoints

- `POST /api/inquiries` - Submit customer inquiry
- `POST /api/visits` - Track page visits
- `GET /api/inquiries` - Get all inquiries (for admin)
- `GET /api/visits` - Get visit analytics (for admin)

## Pricing Information

- **Universal TPMS Sensors**: 7500₸
- **OEM TPMS Sensors**: 15000₸
- **Sensor Installation**: from 2000₸
- **Battery Replacement**: 5000₸
- **Programmers**: Price on request

## Language Support

The website automatically detects user preference and supports:
- **Russian (РУС)**: Default language
- **Kazakh (ҚАЗ)**: Full translation available

Switch languages using the toggle in the header.

## Company Statistics

- 5+ years in TPMS technology market
- 50,000+ sensors installed
- 2,000+ satisfied customers

## Contact Information

- **Location**: Almaty, Kazakhstan
- **Email**: info@farsensor.kz
- **Services**: Professional TPMS installation and support

## Technical Details

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: In-memory storage (can be upgraded to PostgreSQL)
- **Deployment**: Compatible with most hosting providers

## Troubleshooting

### Build Issues
If you encounter resource exhaustion errors during build:
1. Use the simple deployment option
2. Build only frontend: `npx tailwindcss -o public/css/styles.css`
3. Use `app.js` instead of complex TypeScript setup

### Hosting Provider Issues
For providers with limited resources:
1. Use `package-simple.json` (rename to `package.json`)
2. Only install Express: `npm install express`
3. Start with: `node app.js`

## Customization

### Adding Images
Place images in `public/images/` directory:
- `logo.png` - Company logo
- `hero-bg.jpg` - Hero section background
- `favicon.ico` - Website favicon

### Updating Contact Info
Edit the contact section in `public/index.html` and `public/js/main.js` translations.

### Adding New Languages
1. Add translations to `translations` object in `public/js/main.js`
2. Update language switcher in `initializeLanguageSwitcher()`

## License

MIT License - feel free to customize for your needs.