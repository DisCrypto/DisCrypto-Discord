const Discord = require('discord.js');

module.exports = {
    name: 'newacc',
    type: 'core',
    usage: 'newacc',
    example: 'newacc',
    permission: 1,
    help: 'Create a new tipping account.',
    main: async function (bot, message) {
        let c = await bot.getAccount(message.author).catch(()=>{ return message.channel.send(`We encountered an error, sorry!`);});
        if (c) {
            return message.channel.send(`Your account already exists. Use \`balance\` to view it.`);
        } else {
            //create new
            let err = bot.addAccount(message.author);
            if (err) return message.channel.send(`We encountered an error, sorry!`);
            let emb = new Discord.RichEmbed()
                .setTitle(`New account created`)
                .setThumbnail(bot.user.displayAvatarURL)
                .setColor(`DARK_GREEN`)
                .setDescription(`An account was created under your user ID.`)
                .addField(`Tipping Guide`, `\n\`tip [user] [amount]\` - Tip a user\n\n\`balance\` - Check your tip balance\n\n\`deposit\` - Begin the deposit process\n\n\`withdraw\` - Begin the withdraw process`);

            message.channel.send(emb);
        }
    },
};
