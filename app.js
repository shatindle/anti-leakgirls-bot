const isPorn = require("./pornDetection").isPorn;
const extractText = require("./extractText");
const resizeImage = require("./resizeImage");
const greyscaleImage = require("./greyscaleImage");
const bodyParser = require("./bodyParser");
const axios = require("axios");
const fs = require('fs');
const RedditApi = require("snoowrap");
const oauth_info = require("./oauth_info.json");
const settings = require("./settings.json");

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

const reddit = new RedditApi(oauth_info);

const idCache = [];

function addToCache(item) {
    idCache.unshift(item);

    while (idCache.length > 100)
        idCache.pop();
}

function checkIdCache(item) {
    for (var i = 0; i < idCache.length; i++) {
        if (idCache[i] === item) {
            var first = idCache[i];

            idCache.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; });
            
            return first;
        }
    }
}

async function assessPorn() {
    // moved sub to the settings.json file
    let sub = settings.subreddit;
    console.log("Assessing...");
    let modqueue = await reddit.getSubreddit(sub)
        .getModqueue();
        //.getSpam();

    let spam = await reddit.getSubreddit(sub)
        .getSpam();

    let posts = modqueue.concat(spam);
    
    console.log("Found " + posts.length + " items in queue");
    
    await asyncForEach(posts, async (submission) => {
        var username = submission.author.name;
        var url = submission.url;
        var id = submission.id;
        var content = submission.body;

        if (checkIdCache(id))
            return;

        addToCache(id);

        try {
            var isBanned =  await reddit.getSubreddit(sub).getBannedUsers({ name: username });

            for (var i = 0; i < isBanned.length; i++) {
                if (isBanned[i].name === username)
                    return;
            }
        } catch {
            // keep going I guess
        }
        
        if (url) {
            if (await interrogate(sub, submission, username, url, id)) {
                // maybe do something someday
            }
        } else if (content) {
            var urls = bodyParser(content);

            if (urls.length) {
                for (var i = 0; i < urls.length; i++) {
                    url = urls[i];

                    if (await interrogate(sub, submission, username, url, id)) {
                        // maybe do something someday
                        break;
                    }
                }
            }
        } else {
            console.log(id + " is not an image");
        }
        
    });

    setTimeout(assessPorn, 10000);
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function interrogate(sub, submission, username, url, id) {
    let identified = false;
    try {
        console.log(id + " is an image");
        var lastDot = url.lastIndexOf(".");
        var extension = url.substr(lastDot, url.length - lastDot);

        if (!extension.match(/^\.[a-zA-Z]+$/))
            return identified;

        var imageFile =  "./possiblePorn/image-" + makeid(10) + extension;
        await download_image(url, imageFile);

        try {
            var isporn = await run(imageFile);

            if (isporn) {
                console.log(id + " is porn - removing and banning");
                await submission.remove();
                await reddit.getSubreddit(sub).banUser({name: username, banReason: 'No NSFW content', banNote: "porn" });
                identified = true;
            } else {
                console.log(id + " is probably not porn");
            }
        } catch (ex) {
            console.log(id + " something went wrong when processing this ID");
        }

        fs.unlinkSync(imageFile);
    } catch (errorWithExtraction) {
        console.log("Error pulling data: " + errorWithExtraction);
    }

    return identified;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function run(file) {
    let lastDot = file.lastIndexOf(".");
    let newFile = file.substr(0, lastDot) + "-resized" + file.substr(lastDot, file.length - lastDot);
    let newFile2 = file.substr(0, lastDot) + "-greyscaled" + file.substr(lastDot, file.length - lastDot);

    await resizeImage(file, newFile);
    await greyscaleImage(newFile, newFile2);

    extracted = await extractText(newFile2);
    porn = isPorn(extracted);

    fs.unlinkSync(newFile);
    fs.unlinkSync(newFile2);

    return porn;
}

module.exports = {
    assessAndReportPorn: assessPorn,
    assessPorn: run
};

