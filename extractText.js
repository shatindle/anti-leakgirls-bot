const { createWorker } = require('tesseract.js');
const worker = createWorker();

const status = {
    ready: false
};

async function extractText(imageFile) {
    if (!status.ready) {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        status.ready = true;
    }
    
    var { data: { text } } = await worker.recognize(imageFile);

    return text.split("\n");
}

module.exports = extractText;