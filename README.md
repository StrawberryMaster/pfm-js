# pfm-js
<p align="center">
 <img src="https://img.shields.io/github/license/StrawberryMaster/pfm-js?style=for-the-badge" alt="License">
 <img src="https://img.shields.io/github/package-json/v/StrawberryMaster/pfm-js?style=for-the-badge" alt="Version">
 <img src="https://img.shields.io/github/repo-size/StrawberryMaster/pfm-js?style=for-the-badge" alt="Size">
 <img src="https://img.shields.io/github/last-commit/StrawberryMaster/pfm-js?style=for-the-badge" alt="Last Commit">
 <img src="https://img.shields.io/github/languages/code-size/StrawberryMaster/pfm-js?style=for-the-badge" alt="Code Size">
</p>
A weird Discord bot, lover of cookies and banana bread. PFM uses the [Discord.js](https://discord.js.org) library.

## Installation
### Requirements
- either [Bun](https://bun.sh) or [Node.js](https://nodejs.org/en/) (v12 or higher)
- [Git](https://git-scm.com/)

### Setting up your environment
1. [Fork](https://guides.github.com/activities/forking/#fork) this repository
2. Then [clone](https://guides.github.com/activities/forking/#clone) your forked repository to your local machine
3. Install the dependencies with either `npm install` or `bun install`

### Creating a Discord application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on "New Application" and give it a name
3. Go to the "Bot" tab and click on "Add Bot"
4. Click on "Copy" under "Token" and paste it into a file called `config.json` in the root of the repository. Don't share this token with anyone! It will look like this:
```json
{
    "token": "your-token-here"
}
```
5. Invite your bot to your server by going back to the `General Infomration` tab, and writing down the `Client ID`. Replace `CLIENT_ID` in the following URL with that number and paste it into your web browser:   
`https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot`
6. Follow the on-screen instructions to invite your bot to your server

### Running the bot
Simply use `npm start` or `bun start` to start the bot. If this is not working, feel free to use `node boot.js` or `bun boot.ts` instead.