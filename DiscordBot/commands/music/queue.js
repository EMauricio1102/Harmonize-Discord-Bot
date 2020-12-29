const Discord = require("discord.js")
const color = require('../../colors.json')

module.exports = { 
    config: {
        name: "queue",
        aliases: ["q"],
        description: "Pauses songs that are currently being played through the player.",
        usage: "!pause",
        category: "music",
        accessableby: "Members"
    },
    run: async (bot, message, args) => 
    {
        const player = bot.music.players.get(message.guild.id); 
        if(!player && player.queue[0])
        return message.channel.send("The queue is currently empty").then(message => message.delete({timeout: 10000}).catch(console.error));

        let index = 1; 
        let string = "";

        if(player.queue[0])
        {
            string += `__**Currently Playing**__\n ${player.queue[0].title} - **Requested by: ${player.queue[0].requester.username}**.\n`;
        }
        if(player.queue[1])
        {
            string += `__**Following Queue:**__\n  ${player.queue.slice(1, 10).map(x => `**${index++})** ${x.title} - **Requested by: ${x.requester.username}**.`).join("\n")}`;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(color.gold)
            .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL)
            .setThumbnail(player.queue[0].thumbnail)
            .setDescription(string);

        return message.channel.send(embed).then(message => message.delete({timeout: 10000}).catch(console.error));
    }
}