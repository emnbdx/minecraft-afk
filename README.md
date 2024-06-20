# Minecraft AFK Bot

This repository hosts the source code for a user-friendly Minecraft AFK (Away From Keyboard) bot, developed using the Telegraf framework for Node.js. Designed to integrate seamlessly with Telegram, this bot not only manages server connections but also enables direct chat interactions through Telegram and provides live game previews.

Experience the capabilities of this AFK bot firsthand by trying it out on Telegram: [Minecraft AFK Bot](https://t.me/mc_afk_bot).

## Features

- **Server Management**: Configure the bot to connect to your desired Minecraft server, allowing for seamless game management directly through Telegram.

- **Server Information**: Obtain real-time updates on the server's status, including details about connected players, ensuring you're always informed about server activity.

- **Live Preview**: Enjoy a live preview of the Minecraft world, viewable directly online, providing a visual snapshot of the game environment without needing to log in.

- **Integrated Chat**: Experience integrated communication capabilities, where you can receive messages from the Minecraft server and respond back via Telegram. This feature bridges the gap between in-game and external communication effortlessly.

## Prerequisites

Before you can run the bot, you need the following:
- node.js
- npm
- Telegram bot token (You can get one from [BotFather](https://t.me/botfather))

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/emnbdx/minecraft-afk.git
   cd minecraft-afk
   ```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Environment Variables**
Create a .env file from .env.example in the root directory and add your informations.

```plaintext
MC_USERNAME=
MC_VERSION=1.20.4
VIEWER_PORT=3007
TELEGRAM_TOKEN=
```

## Usage
To run the bot, use the following command:

```bash
node app.js
```

**Available Commands**
/set [server] - Set the Minecraft server address.
/server - Display current configured server.
/list - Display players on server.
/connect - Connect the bot to the specified Minecraft server.
/disconnect - Disconnect from server

## Contributing
Contributions are welcome! Please feel free to submit pull requests or open issues to improve the functionality or fix problems with the bot.