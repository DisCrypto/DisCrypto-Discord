const Discord = require('discord.js');

module.exports = {
    name: 'balance',
    type: 'core',
    usage: 'balance',
    example: 'balance',
    permission: 1,
    help: 'Check your account balance/stats.',
    main: async function (bot, message) {
        let acc = await bot.getAccount(message.author).catch(()=>{ return message.channel.send(`We encountered an error, sorry!`);});
        if (!acc) {
            bot.addAccount(message.author);
            return message.channel.send(`You do not have a tipping account, so one was created for you. Run the command again to view it.`);
        } else {
            //create new
            let emb = new Discord.RichEmbed()
                .setTitle(`${message.author.username}'s Tipping Account`)
                .setThumbnail(message.author.displayAvatarURL)
                .setColor(`GOLD`)
                .setDescription(`Detailed stats on your tipping account.`)
                .addField(`Balance`, acc.balance, true)
                .addField(`# of Tips Sent/Received`, acc.count, true);

            message.channel.send(emb);
        }
    },
};
