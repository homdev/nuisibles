const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/assets/img';
const outputDir = 'public/assets/img/optimized';

async function compressImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .resize(400, 300, {
        fit: 'cover',
        withoutEnlargement: true
      })
      .toFile(outputPath.replace('.webp', '-mobile.webp'));

    // Version desktop
    await sharp(inputPath)
      .webp({ quality: 80 })
      .resize(800, 600, {
        fit: 'cover',
        withoutEnlargement: true
      })
      .toFile(outputPath);

    console.log(`Compressed: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}

async function processDirectory() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);
      await compressImage(inputPath, outputPath);
    }
  }
}

processDirectory(); 