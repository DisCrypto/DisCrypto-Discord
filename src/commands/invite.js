const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    type: 'core',
    usage: 'invite',
    example: 'invite',
    permission: 1,
    help: 'Generate support server/bot invite links',
    main: async function (bot, message) {
        let emb = new Discord.RichEmbed()
            .setTitle(`Bot Resources`)
            .setThumbnail(bot.user.displaytAvatarURL)
            .setColor(`GOLD`)
            .addField(`Bot Invite`, `[Here](https://discordapp.com/oauth2/authorize?client_id=411996950670344234&permissions=0&scope=bot)`,true)
            .addField(`Support Server`, `[Here](https://discord.gg/Xg5V8mn)`,true);

        message.channel.send(emb);
    },
};
