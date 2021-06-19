const urlRegex = /(https?:\/\/[^ ]*)/;

function extractUrlsFromContent(content) {
    try {
        let urls = [];

        if (!content)
            return urls;

        let url;
        content.match(urlRegex).forEach((match) => {
            urls.push(match);
        });

        return urls.filter(onlyUnique);
    } catch (err) {
        console.log("unable to parse URLs: " + err);
        return [];
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

module.exports = extractUrlsFromContent;