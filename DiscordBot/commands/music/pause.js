module.exports = 
{ 
    config:
    {
        name: "pause",
        aliases: ["unpause"],
        description: "Pauses songs that are currently being played through the player.",
        usage: "!pause",
        category: "music",
        accessableby: "Members"
    },
    run: async (bot, message, args) => 
    {
        const player = bot.music.players.get(message.guild.id); 
        const voiceChannel = message.member.voice.channel;
        if( !player )
        {
            return message.channel.send("There are no songs being played at the moment.").then(message => message.delete({timeout: 10000}).catch(console.error));
        }
        
        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id)
        {
            return message.channel.send("You need to be in the voice channel to pause the song.").then(message => message.delete({timeout: 10000}).catch(console.error));
        }
        
        player.pause(player.playing);
            return message.channel.send(`Harmonize is currently ${player.playing ? "playing!" : "paused!"}`).then(message => message.delete({timeout: 10000}).catch(console.error));
    }
}