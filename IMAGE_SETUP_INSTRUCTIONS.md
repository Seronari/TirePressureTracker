# Image Setup Instructions for Deployment

When you deploy your TPMS website to hosting, follow these simple steps to use your own images:

## 1. Create Images Folder
Create a folder called `images` in your website's public directory (usually `public/images/` or just `images/` in the root).

## 2. Add Your Images
Place your images in the folder with these exact names:

- `hero-bg.jpg` - Background image for the main hero section
- `about-section.jpg` - Image for the About Us section  
- `universal-sensors.jpg` - Image for Universal TPMS Sensors product
- `oem-sensors.jpg` - Image for OEM Sensors product
- `programmers.jpg` - Image for TPMS Programmers product

## 3. Image Recommendations
- **Size**: Hero background should be at least 1920x800px, other images 800x600px
- **Format**: JPG or PNG format
- **Quality**: High quality but optimized for web (under 500KB each)
- **Content**: 
  - Hero: Automotive/tire related background
  - About: Professional company or technology image
  - Products: Clear photos of TPMS sensors and equipment

## 4. That's It!
Your website is already configured to use these local images. No code changes needed - just upload your images with the correct names and they'll appear automatically!

## Current Setup
The website is already prepared to use local images instead of external URLs. All image paths are configured in the code to point to `/images/[filename]`.