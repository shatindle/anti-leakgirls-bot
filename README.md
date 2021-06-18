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

## If you've never setup a Reddit bot before, here are the steps to do so:

The steps I would recommend for getting this setup:

- Install [Node.js](https://nodejs.org/en/download/) so you can run the code.
- Install an Integrated Development Environment such as [Visual Studio Code](https://code.visualstudio.com/download).  This will make it easier to see the code and run it.
- Install [GitHub Desktop](https://desktop.github.com/).  This will require you create a GitHub account and sign into the GitHub Desktop app.  GitHub is owned my Microsoft, and it's free to use.  It allows you to download any updates to the bot code easily.
- Open [the source code](https://github.com/shatindle/anti-leakgirls-bot) page and click the green Code button in the upper right and click "Open with GitHub Desktop".  This will open GitHub Desktop and ask you where you'd like to save the code.  I usually leave it in the default location (Documents/GitHub/*).
- There should be an option in the middle of the GitHub Desktop window now that says "Open the repository in your external editor" with a button that says "Open in Visual Studio Code".  This will open Visual Studio Code in the folder you selected previously.
- In the menu across the top in Visual Studio Code, click Terminal, then New Terminal.  This should open an integrated terminal at the bottom of Visual Studio Code.
- Type "npm install" and hit enter in the terminal.  This will get the necessary dependencies based on the information in package.json.

The above steps prepared your environment, but you're not quite ready to run the application yet.  To configure the application so you can run it, do the following:

- In Visual Studio Code, open the "settings.json" file (it should be in the file list on the left).  Change the subreddit from "r/Splatoon" to your subreddit.

Next, you'll need to create a reddit application so the code can talk to reddit on your behalf.  There is [a guide from Reddit](https://github.com/reddit-archive/reddit/wiki/OAuth2), but it can be confusing for first time users.

- Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps), scroll to the bottom, and click "create an app...".
- Give the app a name (something you'll recognize it by such as anti-leakgirls-bot).
- Select the "script" checkbox.
- Give it a description.  Again, this is just for your information.
- Set the "redirect uri" to https://not-an-aardvark.github.io/reddit-oauth-helper/ (we will change this later, we just need it set to this so we can generate a refresh token for the app).
- Click create app
- Leave this tab open (we'll come back to it later to change the redirect uri).

You now have a reddit app for the bot to use.  Write down the client ID and secret - we will need these later.  __Protect them both__ - do not share them or post them publicly.  We need to generate a refresh token and to allow the API to talk to Reddit.

Go to [https://github.com/not-an-aardvark/reddit-oauth-helper](https://github.com/not-an-aardvark/reddit-oauth-helper).  This is a helper app created by Teddy Katz, the developer of Snoowrap - the JavaScript API library for Reddit.  You have 2 options: download and run his app locally, or use the web version.  The web version is easier and requires no setup.  I have used both, but I will speak to the web version since it's easier to use.  The web version is located at [https://not-an-aardvark.github.io/reddit-oauth-helper/](https://not-an-aardvark.github.io/reddit-oauth-helper/).

- On the Reddit OAuth Helper page, enter the Client ID and Secret you saved previously.
- Click the Permanent checkbox.
- Check "read", "modcontributors", and "modposts".  You can read why on [my README page for the bot](https://github.com/shatindle/anti-leakgirls-bot).
- Click "Generate tokens".  This will redirect you to Reddit where it will ask if you want to authorize the application you created to act on your behalf.
- Click "Allow", and you'll be taken back to the Reddit OAuth Helper.  At the bottom, you should have a refresh token.  Save that token.

You now have the last piece of information you need to configure and run the bot.

- Go back to Visual Studio Code.
- Rename the oauth_info.sample.json file to oauth_info.json.
- Open the oauth_info.json file.
- Change the userAgent to something like "Anti-leakgirls-bot".
- Change clientId to your client ID you saved previously.
- Change clientSecret to your secret you saved previously.
- Change refreshToken to your refresh token you saved previously.
- Change scope to "read modcontributors modposts".
- Save the file.

At this point, you'll want to go back to the tab you left open at [https://www.reddit.com/prefs/apps].

- You may want to refresh this page.
- Find the application you created and click edit.
- Change the redirect uri to "http://127.0.0.1:65010/authorize_callback".
- Click update app.

Now you just need run the bot.

- In the terminal at the bottom of Visual Studio Code, type "node ./index.js" and hit enter.  
- The bot should start, and you should see output saying "Assessing..." and "Found 0 items in queue" every 20 seconds.  The bot is now polling your subreddit's mod queue looking for porn posts.  If it finds any, it will download the image, OCR it, look for the leakgirls text, and ban the account if it is leakgirls.  It will then remove the images it downloaded from your PC.

If the bot errors, just close and re-open Visual Studio Code, open a terminal, and type "node ./index.js" and hit enter again.