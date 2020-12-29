module.exports = 
{ 
    config: 
    {
        name: "skip",
        aliases: ["next"],
        description: "Skips to the next track of the queue.",
        usage: "!skip",
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
            return message.channel.send("You need to be in the voice channel to skip the song.").then(message => message.delete({timeout: 10000}).catch(console.error));
        }
        
        player.stop();
        return message.channel.send("Song Skipped!").then(message => message.delete({timeout: 10000}).catch(console.error));;
    }
}