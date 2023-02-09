const {Client, Collection, MessageEmbed} = require("discord.js");
const client = new Client();
const prefix = "."
const token = "NjA3MDA3ODEzNzU0OTQ1NTQ3.XUTWFA.Ed0LjWDhmPnN2x8sPLodURpwKP0"
const io = require('@pm2/io')


client.on("ready!", () => {
    console.log("I am online!")
})

const fs = require('fs');
client.commands = new Collection()
client.aliases = new Collection();

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === 'js')
    if (jsfile.length <=0) {
        return console.log("I couldn't find commands!");
    }

    jsfile.forEach((file, i) => {
        let pullcmd = require(`./commands/${file}`)
        client.commands.set(pullcmd.config.name, pullcmd)
        pullcmd.config.aliases.forEach(aliases => {
            client.aliases.set(aliases, pullcmd.config.name)
        })
    })
})

client.on("message", async message => {

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0]
    let args = messageArray.slice(1)

    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) commandfile.run(client, message, args)

    if (message.content === 'ping') {
        message.reply("Pong!");
    }
})

client.login(token)