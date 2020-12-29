const { Utils } = require("erela.js")
const Discord = require ("discord.js")

module.exports = { 
    config: {
        name: "play",
        description: "Plays a song from the internet.",
        usage: "!play",
        category: "music",
        accessableby: "Members",
        aliases: ["p"]
    },
    run: async (bot, message, args) => {
        const voiceChannel  = message.member.voice.channel;
        if(!voiceChannel) 
        {
            return message.channel.send("You need to be in the voice channel to play music!").then(message => message.delete({timeout: 10000}).catch(console.error));
        }

        const permissions = voiceChannel.permissionsFor(bot.user);
        if(!permissions.has("CONNECT"))
        {
            return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!").then(message => message.delete({timeout: 10000}).catch(console.error));
        }
        
        if(!permissions.has("SPEAK"))
        {
            return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!").then(message => message.delete({timeout: 10000}).catch(console.error));
        } 

        if(!args[0])
        {
            return message.channel.send("Please provide a song name or a link to searach.").then(message => message.delete({timeout: 10000}).catch(console.error));
        } 

        const player = bot.music.players.spawn(
        {
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel
        });

        bot.music.search(args.join(" "), message.author).then(async res => 
        {
            switch (res.loadType) 
            {
                case "TRACK_LOADED":
                    player.queue.add(res.tracks[0]);
                    message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``).then(message => message.delete({timeout: 10000}).catch(console.error));
                    if(!player.playing) player.play()
                    break;

                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        const embed = new Discord.MessageEmbed()
                            .setAuthor("Song Selection." , message.author.displayAvatarURL)
                            .setDescription(tracks.map(video => `**${index++} - ** ${video.title}`))
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection.");
                    
                        message.channel.send(embed).then(message => message.delete({timeout: 10000}).catch(console.error));;

                        const collector = message.channel.createMessageCollector(m => 
                            {
                                return m.author.id === message.author.id && new RegExp(`^([1-5]|Cancel)$`, "i").test(m.content)
                            }, {time: 10000, max: 1});

                        collector.on("collect", m => {
                            if(/cancel/i.test(m.content))
                            {
                                m.delete({timeout: 10000}).catch(console.error);
                                return collector.stop("cancelled")
                            } 
                            
                            const track = tracks[Number(m.content) - 1];
                            player.queue.add(track)
                            message.channel.send(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``).then(message => message.delete({timeout: 10000}).catch(console.error));
                            m.delete({timeout: 10000}).catch(console.error);

                            if(!player.playing) player.play();
                        });

                        collector.on("end", (_, reason) => {
                            if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled Selection!").then(message => message.delete({timeout: 10000}).catch(console.error));
                        });
                        break;

                    case "PLAYLIST_LOADED" :
                        res.playlist.tracks.forEach(track => player.queue.add(track));
                        const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                        message.channel.send(`Enqueuing \`${res.playlist.tracks.title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``).then(message => message.delete({timeout: 10000}).catch(console.error));
                        if(!player.playing) player.play()
                        break;

            }
        }).catch(err => message.channel.send(err.message))

    }
}