require('dotenv').config();
const axios = require('axios');
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { Telegraf } = require('telegraf')

let bot

const telegram = new Telegraf(process.env.TELEGRAM_TOKEN)
telegram.catch((err) => {
    console.error('Error occurred', err)
})

telegram.telegram.setMyCommands([
    {
      command: 'co',
      description: 'Connect to server for AFK',
    },
    {
      command: 'deco',
      description: 'Disconnect from server',
    },
    {
      command: 'list',
      description: 'List players on server',
    }
  ]);

  telegram.command('co', () => {
    createBot()
  }); 
  telegram.command('deco', () => {
    bot.viewer.close()
    bot.quit()
  }); 
  telegram.command('list', async () => {
    const serverStatus = await fetchServerStatus(process.env.MC_HOST);
    if (serverStatus && serverStatus.players && serverStatus.players.list) {
        const players = serverStatus.players.list;
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, `Online Players (${players.length}/${serverStatus.players.max}):`);
        players.forEach(player => {
            telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, `${player.name} (UUID: ${player.uuid})`);
        });
    } else {
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, "No players are currently online or server is unreachable.");
    }
  }); 

  telegram.launch();
  
  process.once('SIGINT', () => telegram.stop('SIGINT'));
  process.once('SIGTERM', () => telegram.stop('SIGTERM'));

function createBot() {
    bot = mineflayer.createBot({
        host: process.env.MC_HOST,
        username: process.env.MC_USERNAME,
        auth: 'microsoft',
        version: process.env.MC_VERSION
    })

    bot.once('spawn', () => {
        mineflayerViewer(bot, {
            port: process.env.VIEWER_PORT,
            firstPerson: false,
            version: bot.version
        })
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, ' I\'m back on server ;)')
    })

    bot.on('message', (message) => {
        var msg = message.toString()
        if(msg.startsWith('<' + bot.username + '>'))
            return
        console.log(msg)
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, msg)
    })

    telegram.on('text', (ctx) => {
        if (ctx.update.message.chat.id.toString() === process.env.TELEGRAM_GROUP) {
            bot.chat(ctx.update.message.text)
        }
    })

    // Log errors and kick reasons:
    bot.on('kicked', (msg) => {
        console.log(msg)
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, msg)
    })
    bot.on('error', (msg) => {
        console.log(msg)
        telegram.telegram.sendMessage(process.env.TELEGRAM_GROUP, msg)
    })
}

async function fetchServerStatus(serverIp) {
    try {
        const url = `https://api.mcsrvstat.us/3/${serverIp}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch server data:", error);
        return null;
    }
}