/**
 * PWA Icon Generator Script
 * 
 * This script generates PWA icons from a source image.
 * Run with: node scripts/generate-pwa-icons.js
 * 
 * Requirements: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_IMAGE = path.join(__dirname, '../public/landing/kursfind-ai-logo.jpg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('🎨 Generating PWA icons...');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    process.exit(1);
  }

  const sourceBuffer = fs.readFileSync(SOURCE_IMAGE);

  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .png({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size}:`, error.message);
    }
  }

  // Generate maskable icon (with padding for safe area)
  const maskableSize = 512;
  const maskablePath = path.join(OUTPUT_DIR, `icon-maskable-${maskableSize}x${maskableSize}.png`);
  
  try {
    // Create a larger canvas with the icon centered (80% of canvas)
    const iconSize = Math.floor(maskableSize * 0.8);
    const padding = Math.floor((maskableSize - iconSize) / 2);
    
    const iconBuffer = await sharp(sourceBuffer)
      .resize(iconSize, iconSize, {
        fit: 'cover',
        position: 'center',
      })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: maskableSize,
        height: maskableSize,
        channels: 4,
        background: { r: 6, g: 182, b: 212, alpha: 1 }, // Cyan background
      }
    })
      .composite([{
        input: iconBuffer,
        top: padding,
        left: padding,
      }])
      .png({ quality: 90 })
      .toFile(maskablePath);
    
    console.log(`✅ Generated: icon-maskable-${maskableSize}x${maskableSize}.png`);
  } catch (error) {
    console.error('❌ Failed to generate maskable icon:', error.message);
  }

  console.log('\n🎉 PWA icons generated successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch(console.error);
