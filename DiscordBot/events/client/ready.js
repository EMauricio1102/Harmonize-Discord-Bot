const { ErelaClient, Utils } = require ("erela.js");
const config = require ("../../botconfig.json")

module.exports = bot => {
    console.log(`${bot.user.username} is online`);


    bot.music = new ErelaClient(bot, config.nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Successfully created a new node"))
        .on("queueEnd", player => 
        {
            player.textChannel.send("Queue has ended.").then(message => message.delete({timeout: 10000}).catch(console.error));
            return //bot.music.players.destroy(player.guild.id)
        })
        .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now playing **${title}** \`${Utils.formatTime(duration, true)}\``).then(message => message.delete({timeout: 10000}).catch(console.error)))

    bot.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);

    //let activities = [ `${bot.guilds.size} servers!`, `${bot.channels.size} channels!`, `${bot.users.size} users!` ], i = 0;
    setInterval(() => bot.user.setActivity(`music | type ${config.prefix}help for commands`, { type: "PLAYING" }), 15000)

};