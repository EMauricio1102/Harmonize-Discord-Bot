const { prefix } = require("../../botconfig.json");

module.exports = async (bot, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;
    if(message.author.bot.content === "No tracks were found.") message.author.bot.delete({timeout: 10000}).catch(console.error);

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(prefix)) return;
    if(message.content.startsWith(prefix))
    {
        message.delete({timeout: 10000}).catch(console.error);
    }
     
    let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
    if(commandfile) 
    {
        commandfile.run(bot, message, args)
    }

    
}