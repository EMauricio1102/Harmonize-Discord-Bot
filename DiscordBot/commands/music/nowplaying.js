const Discord = require ("discord.js")
const { Utils } = require ("erela.js")
const { stripIndents } = require("common-tags")
const color = require ("../../colors.json")

module.exports = 
{
    config: 
    {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Shows the channel what song is currently playing.",
        accessableby: "Member",
        category: "music"
    },

    run: async (bot, message, args) =>
    {
        const player = bot.music.players.get(message.guild.id);
        if(!player || !player.queue[0])
        {
            return message.channel.send("No song is currently playing at the moment.").then(message => message.delete({timeout: 10000}).catch(console.error));
        }
        const { title, author, duration, url, thumbnail } = player.queue[0];
        const embed = new Discord.MessageEmbed()
            .setColor(color.red_dark)
            .setAuthor("Current song playing: " , message.author.displayAvatarURL)
            .setThumbnail(thumbnail)
            .setDescription(stripIndents
            `
                ${player.playing ? ":arrow_forward:" : ":pause_button:"} **${title}** \`${Utils.formatTime(duration, true)}\` by ${author}
            `)
        return message.channel.send(embed).then(message => message.delete({timeout: 10000}).catch(console.error));
    }
}