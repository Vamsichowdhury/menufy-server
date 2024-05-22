const sharp = require('sharp');

// Function to resize image to 900x675 pixels
async function resizeImage(inputPath, outputPath) {
    await sharp(inputPath)
        .resize(900, 900)
        .toFile(outputPath);
}

module.exports = resizeImage;
