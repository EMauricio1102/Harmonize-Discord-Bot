module.exports = 
{
    config: 
    {
        name: "leave",
        aliases: ["stop"],
        description: "Makes the bot leave the voice channel.",
        uasge: "!leave",
        accessableby: "Member",
        category: "music"
    },
    run: async (bot, message, args) =>
    {
        const player = bot.music.players.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;

        if( !player ) 
        {
            return message.channel.send("No song(s) currently playing...").then(message => message.delete({timeout: 10000}).catch(console.error));
        } 

        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id)
        {
            return message.channel.send("You need to be in the voice channel to use the leave command.").then(message => message.delete({timeout: 10000}).catch(console.error));
        }     
         
        bot.music.players.destroy(message.guild.id);
        return message.channel.send("It was my pleasure to provide solid entertainment to your discord. Good Bye! :wave: :blush:").then(message => message.delete({timeout: 10000}).catch(console.error));
    }
}