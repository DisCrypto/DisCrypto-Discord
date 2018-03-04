const Discord = require('discord.js');
module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help',
    permission: 1,
    help: 'List commands.',
    main: async function (bot, message) {
        let prefix = await bot.getPrefix(message);

        let emb = new Discord.RichEmbed()
            .setTitle(`DisCrypto Commands`)
            .setThumbnail(bot.user.displayAvatarURL)
            .setDescription(`The prefix for this server is **${prefix}**`)
            .addField(`💸 Price Info`, '`$[coin]` ex: $btc\n`top [num]` ex: top 5\n`convert [amount] [from] [to])` ex: convert 5 btc xmr',true)
            .addField(`🔧 Utility`, '`genwallet [BTC, ETH, LTC, XRP, BCH]` ex: genwallet btc\n`coininfo [coin]` \n`invite`',true)
            .addField(`🎊 Fun`, '`flippening`\n')
            .addField(`🛠 Management Commands`, '`ping`\n`setprefix`\n`shardinfo`', true)
            .setColor(`GOLD`)
            .setAuthor(bot.user.username, bot.user.avatarURL);
        message.channel.send(emb);
    },
};
