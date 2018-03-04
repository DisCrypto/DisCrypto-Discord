const Discord = require('discord.js');
module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help',
    permission: 1,
    help: 'List commands.',
    main: function (bot, message) {
        let emb = new Discord.RichEmbed()
            .setTitle(`DisCrypto Commands`)
            .setThumbnail(bot.user.displayAvatarURL)
            .addField(`💸 Price Info`, '`$(coin)` ex: $btc\n`top (num)` ex: top 5\n`convert (amount) (from) (to)` ex: convert 5 btc xmr',true)
            .addField(`🔧 Utility`, '`genwallet (BTC, ETH, LTC, XRP, BCH)` ex: genwallet btc',true)
            .addField(`🎊 Fun`, '`flippening`\n')
            .addField(`🛠 Management Commands`, '`ping`\n`shardinfo`\n`setprefix`\n`reload`\n`eval`', true)
            .setColor(`GREEN`)
            .setAuthor(bot.user.username, bot.user.avatarURL);
        message.channel.send(emb);
    },
};
