const similarity = require("./similarity");

const imageText = [
    "record cam girls from any site",
    "leakgirls.com",
    "play porn games",
    "lustgames.org",
    "daily nudes and online dating",
    "xxxnudes.xyz",
    "hot models being fucked live",
    "modelslive.xyz",
    "boner pills and penis enlargement",
    "bonerpills.xyz"
];

function isPorn(lines) {
    if (!lines.length)
        return false;

    let numberOfMatches = 0;

    for (var it = 0; it < imageText.length; it++) {
        var found = false;
        var compareTo = imageText[it].toLowerCase();

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].toLowerCase();

            if (similarity(line, compareTo) > 0.9) {
                found = true;
                break;
            }
        }

        if (found)
            numberOfMatches++;

        if (numberOfMatches > 3)
            return true;
    }
    
    return numberOfMatches > 3;
}

module.exports = {
    isPorn: isPorn
};