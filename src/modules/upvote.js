const Discord = require('discord.js');

module.exports = {
    name: 'upvote',
    type: 'core',
    usage: 'upvote',
    example: 'upvote',
    permission: 1,
    help: 'Generate upvote link.',
    main: async function (bot, message) {
        let emb = new Discord.RichEmbed()
            .setTitle(`Upvote DisCrypto`)
            .setThumbnail(bot.user.displayAvatarURL)
            .setDescription(`Upvoting this bot really helps the developers out and lets the bot get more publicity!`)
            .setColor(`ORANGE`)
            .addField(`Discord Bot List`, `[Upvote Here](https://discordbots.org/bot/411996950670344234/vote)`,true);

        message.channel.send(emb);
    },
};
