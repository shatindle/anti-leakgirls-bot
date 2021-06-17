const Calipers = require('calipers')('png', 'jpeg');
const sharp = require('sharp');

function getNewDimensions(oldWidth, oldHeight) {
    let desiredWidth = 400;
    let desiredHeight = (desiredWidth / oldWidth) * oldHeight;

    return {
        width: desiredWidth,
        height: desiredHeight
    };
}

async function resizeImage(file, newFile) {
    let result = await Calipers.measure(file);
    let oldWidth = result.pages[0].width;
    let oldHeight = result.pages[0].height;
    let newDimensions = getNewDimensions(oldWidth, oldHeight);

    let newFileInfo = await (sharp(file)
        .resize({ height:Math.ceil(newDimensions.height), width:Math.ceil(newDimensions.width)})
        .toFile(newFile));
}

module.exports = resizeImage;