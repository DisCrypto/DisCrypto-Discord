module.exports = {
    name: 'eval',
    type: 'owner',
    usage: 'eval <code>',
    permission: 6,
    help: 'Allows bot administrators to evaluate code to test the bot.',
    main: function(bot, msg) {
        const Discord = require('discord.js'),
            util = require('util');

        if (msg.author.id === require('../config.json').owner) {
            var code = msg.content;
            var embed = new Discord.RichEmbed()
                .setFooter(`${msg.author.username}`, `${msg.author.avatarURL}`)
                .setTimestamp();
            try {
                let evaled = eval(code);
                let type = typeof evaled;
                let insp = util.inspect(evaled, {
                    depth: 0,
                });

                if (evaled === null) evaled = 'null';

                embed.setTitle('Javascript Evaluation Complete')
                    .setColor(0x00FF00)
                    .addField('Result', '```js\n' + clean(evaled.toString().replace(bot.token, 'REDACTED')) + '```');
                if (evaled instanceof Object) {
                    embed.addField('Inspect', '```js\n' + insp.toString().replace(bot.token, 'REDACTED') + '```');
                } else {
                    embed.addField('Type', '```js\n' + type + '```');
                }
                msg.channel.send({ embed: embed });
            } catch (err) {
                embed.setTitle('Error Thrown in Javascript Evaluation')
                    .setColor(0xFF0000)
                    .addField('Error', '```LDIF\n' + clean(err.message) + '```');
                msg.channel.send({ embed: embed });
            }
        } else {
            msg.reply('you do not have permission to use eval!');
        }

        function clean(text) {
            if (typeof text === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            } else {
                return text;
            }
        }
    },
};
