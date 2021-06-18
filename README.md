# anti-leakgirls-bot

This is a reddit bot that can identify and remove the leakgirls posts that have been plaguing reddit recently.  In order to use this, you will need to [create an application on reddit](https://github.com/reddit-archive/reddit/wiki/OAuth2) and [generate a refresh token](https://github.com/not-an-aardvark/reddit-oauth-helper).

The following are the scopes I used:
- read (used to see the content of the submission)
- modcontributors (used to ban the user)
- modposts - (used too access mod queue)

To run the application, do the following:
- Rename the oauth_info.sample.json to oauth_info.json
- Fill out oauth_info.json with your application ID, secret, and scopes
- Set the settings.json file to your subreddit (example is "r/Splatoon")
- Run npm install
- Run node ./index.js

If you're downloading this as an update, be sure to run npm install again as the dependencies may have changed.

In my testing, I saw 92% of the leakgirls bot accounts banned and their posts removed.

### Update: 100% success raite, 0% false positive

I've altered the logic of text detection a bit.  47 out of 47 images were correctly detected as porn.