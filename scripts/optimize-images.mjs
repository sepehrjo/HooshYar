import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = '/Users/sepehrjokanian/Desktop/HooshYar/HooshYar/public/works/shahmaghz';
const targetWidth = 800;
const targetHeight = 450; // 16:9 aspect ratio

async function optimizeImages() {
  try {
    if (!fs.existsSync(sourceDir)) {
      console.error(`Source directory not found: ${sourceDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(sourceDir).filter(file => {
      // Process JPEG files that are not backups
      return (file.endsWith('.jpg') || file.endsWith('.jpeg')) && !file.includes('.orig.');
    });

    console.log(`Found ${files.length} images to process in ${sourceDir}`);

    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      
      const backupPath = path.join(sourceDir, `${baseName}.orig${ext}`);
      const webpPath = path.join(sourceDir, `${baseName}.webp`);

      console.log(`\n--------------------------------------------`);
      console.log(`Processing: ${file}`);

      // Rename original file to backup
      fs.renameSync(filePath, backupPath);

      try {
        // 1. Generate optimized JPEG
        console.log(`- Resizing and optimizing JPEG to ${targetWidth}x${targetHeight}...`);
        await sharp(backupPath)
          .resize({
            width: targetWidth,
            height: targetHeight,
            fit: 'cover',
            position: 'top' // Keep top of the page for screenshot layouts
          })
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(filePath);
        
        const origSize = fs.statSync(backupPath).size;
        const newJpgSize = fs.statSync(filePath).size;
        console.log(`  JPEG optimized: ${(origSize / 1024).toFixed(1)} KB -> ${(newJpgSize / 1024).toFixed(1)} KB`);

        // 2. Generate optimized WebP
        console.log(`- Converting and optimizing WebP to ${targetWidth}x${targetHeight}...`);
        await sharp(backupPath)
          .resize({
            width: targetWidth,
            height: targetHeight,
            fit: 'cover',
            position: 'top'
          })
          .webp({ quality: 80 })
          .toFile(webpPath);
        
        const newWebpSize = fs.statSync(webpPath).size;
        console.log(`  WebP generated: ${(newWebpSize / 1024).toFixed(1)} KB`);

        // Clean up backup file
        fs.unlinkSync(backupPath);
        console.log(`- Successfully processed ${file}`);

      } catch (err) {
        console.error(`Error processing ${file}:`, err);
        // Restore original JPEG from backup if it fails
        if (fs.existsSync(backupPath)) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          fs.renameSync(backupPath, filePath);
          console.log(`- Restored original file from backup due to error`);
        }
      }
    }
    
    console.log(`\n============================================`);
    console.log(`All image processing completed successfully!`);
  } catch (err) {
    console.error('Fatal error in optimization script:', err);
    process.exit(1);
  }
}

optimizeImages();
