const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    name: 'shardinfo',
    type: 'core',
    usage: 'shardinfo',
    permission: 1,
    help: 'Gives you information on the bot\'s shards.',
    main: function(bot, msg) {
        bot.shard.fetchClientValues('guilds.size').then(guilds => {
            bot.shard.fetchClientValues('uptime').then(uptime => {
                let averageUptime = (uptime[0] + uptime[1]) / 2;
                const embed = new RichEmbed()
                    .setColor(msg.guild.me.displayColor)
                    .setAuthor(bot.user.username, bot.user.avatarURL)
                    .setTitle('Shard Info')
                    .addField('Total Shards:', bot.shard.count, true)
                    .addField('Total Servers:', guilds.reduce((prev, val) => prev + val, 0).toLocaleString(), true)
                    .addBlankField(true);

                for (var i = 0; i < guilds.length; i++) {
                    embed.addField('Shard ' + i + ' Servers:', guilds[i].toLocaleString(), true);
                }

                embed.addBlankField(true)
                    .addField('Average Shard Uptime:', moment.duration(averageUptime).format(' D [days], H [hrs], m [mins], s [secs]'), true);
                for (var j = 0; j < guilds.length; j++) {
                    embed.addField('Shard ' + j + ' Uptime:', moment.duration(uptime[j]).format(' D [days], H [hrs], m [mins], s [secs]'), true);
                }
                msg.channel.send({ embed: embed });
            });
        });
    },
};''
