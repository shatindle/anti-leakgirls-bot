const Jimp = require("jimp");

async function greyscaleImage(oldImage, newImage) {
    let image = await Jimp.read(oldImage);

    var x = await image.grayscale().writeAsync(newImage);
}

module.exports = greyscaleImage;