require('dotenv').config()
const axios = require('axios')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { session, Telegraf } = require('telegraf')

let bot

const telegram = new Telegraf(process.env.TELEGRAM_TOKEN)
telegram.use(session({ defaultSession: () => ({ server: null, connected: false }) }))
telegram.catch((err) => {
    console.error('Error occurred', err)
})

telegram.telegram.setMyCommands([
    {
        command: 'set',
        description: 'Set minecraft server',
    },
    {
        command: 'connect',
        description: 'Connect to server for AFK',
    },
    {
        command: 'disconnect',
        description: 'Disconnect from server',
    },
    {
        command: 'list',
        description: 'List players on server',
    }
])

telegram.command('set', (ctx) => {
    const fullText = ctx.message.text
    const args = fullText.split(' ').slice(1)
    const userInput = args[0]
    ctx.session.server = userInput

    ctx.reply(`Server set to: ${userInput}`)
})
telegram.command('server', (ctx) => {
    if (!ctx.session.server) {
        ctx.reply('No server set, please set server first using /set')
        return
    }

    ctx.reply(ctx.session.server)
})
telegram.command('connect', (ctx) => {
    if (!ctx.session.server) {
        ctx.reply('No server set, please set server first using /set')
        return
    }

    createBot(ctx)
    ctx.session.connected = true
})
telegram.command('disconnect', (ctx) => {
    if (!ctx.session.connected) {
        ctx.reply('You can\'t disconnect while not connected')
        return
    }

    bot.viewer.close()
    bot.quit()
    ctx.session.connected = false
})
telegram.command('list', async (ctx) => {
    if (!ctx.session.server) {
        ctx.reply('No server set, please set server first using /set')
        return
    }

    const serverStatus = await fetchServerStatus(ctx.session.server)
    if (serverStatus && serverStatus.players && serverStatus.players.list) {
        const players = serverStatus.players.list
        ctx.reply(`Online Players (${players.length}/${serverStatus.players.max}):`)
        players.forEach(player => {
            ctx.reply(`${player.name} (UUID: ${player.uuid})`)
        })
    } else {
        ctx.reply("No players are currently online or server is unreachable.")
    }
})

telegram.launch()

process.once('SIGINT', () => telegram.stop('SIGINT'))
process.once('SIGTERM', () => telegram.stop('SIGTERM'))

function createBot(ctx) {
    bot = mineflayer.createBot({
        host: ctx.session.server,
        username: process.env.MC_USERNAME,
        auth: 'microsoft'
    })

    bot.once('spawn', () => {
        try {
            mineflayerViewer(bot, {
                port: process.env.VIEWER_PORT,
                firstPerson: false,
            })
            ctx.reply('Viewer available at http://ns3206329.ip-37-187-145.eu:3007/')
        } catch {
            ctx.reply('Unable to launch viewer')
        }
    })

    bot.on('message', (message) => {
        var msg = message.toString()
        if (msg.startsWith('<' + bot.username + '>'))
            return
        console.log(msg)
        ctx.reply(msg)
    })

    telegram.on('text', (ctx) => {
        bot.chat(ctx.update.message.text)
    })

    // Log errors and kick reasons:
    bot.on('kicked', (msg) => {
        console.log(msg)
        ctx.reply('kicked')
    })
    bot.on('error', (msg) => {
        console.log(msg)
        ctx.reply('error')
    })
}

async function fetchServerStatus(serverIp) {
    try {
        const url = `https://api.mcsrvstat.us/3/${serverIp}`
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error("Failed to fetch server data:", error)
        return null
    }
}