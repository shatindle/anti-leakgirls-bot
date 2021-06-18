const app = require("./app");
const fs = require("fs");

(async () => {
    const assessment = [];

    const files = fs.readdirSync("./test");

    for (var i = 0; i < files.length; i++) {
        var file = "./test/" + files[i];
        console.log("assessing " + file);
        var isporn = await app.assessPorn(file);

        assessment.push(isporn);
    }

    console.dir(assessment);
})();