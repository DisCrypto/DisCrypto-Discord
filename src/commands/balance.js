const Discord = require('discord.js');

module.exports = {
    name: 'balance',
    type: 'core',
    usage: 'balance',
    example: 'balance',
    permission: 1,
    help: 'Check your account balance/stats.',
    main: async function (bot, message) {
        let account = await bot.getAccount(message.author)

        if (!account) {
            bot.addAccount(message.author);
            return message.channel.send(`You do not have a tipping account, so one was created for you. Run the command again to view it.`);
        } else {
            //create new
            let emb = new Discord.RichEmbed()
                .setTitle(`${message.author.username}'s Tipping Account`)
                .setThumbnail(message.author.displayAvatarURL)
                .setColor(`GOLD`)
                .setDescription(`Detailed stats on your tipping account.`)
                .addField(`Balance`, account.balance || 0, true)
                .addField(`# of Tips Sent/Received`, account.count || 0, true);

            message.channel.send(emb);
        }
    },
};
