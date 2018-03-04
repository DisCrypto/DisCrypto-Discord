const Discord = require('discord.js');
const os = require('os');
const osutils = require('os-utils');
const Promise = require('es6-promise'); //seriosly idk why we need this but it isn't recognized otherwise

module.exports = {
    name: 'stats',
    type: 'core',
    usage: 'stats',
    permission: 1,
    help: 'Check bot stats.',
    main: async function (bot, message) {

        const date = new Date(bot.uptime);
        const uptime = date.getUTCDate() - 1 + 'd ' + date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm ' + date.getUTCSeconds() + 's';
        const cpuUsage = await new Promise(res => {osutils.cpuUsage(v=>res(Math.trunc(v*100)));});

        let users;
        await bot.shard.fetchClientValues('users.size').then(u=> {
            users = u.reduce((a, b) => a + b, 0);
        }).catch(console.error);
        let channels;
        await bot.shard.fetchClientValues('channels.size').then(u=> {
            channels = u.reduce((a, b) => a + b, 0);
        }).catch(console.error);
        let guilds;
        await bot.shard.fetchClientValues('guilds.size').then(u=> {
            guilds = u.reduce((a, b) => a + b, 0);
        }).catch(console.error);

        const shardID = bot.shard.id;
        const shardCount = bot.shard.count;

        let emb = new Discord.RichEmbed()
            .setTitle(`DisCrypto Stats`)
            .setDescription(`\n\n`)
            .setColor(`GREEN`)
            //.setThumbnail(bot.user.displayAvatarURL)
            .addField(`😀 Users`, users, true)
            .addField(`⌨ Channels`, channels, true)
            .addField(`🏆 Guilds`, guilds, true)
            .setFooter(`Made by DaJuukes#0001 and kuroro#4245`);

        if (bot.permLevel(message) == 6) {
            //owner stats
            const cores = os.cpus().length;
            const speed = os.cpus()[0].speed / 1000;
            const ram = (os.totalmem() - os.freemem()) / 1024 / 1000000;
            emb.addField(`🖥 CPU Cores`, cores, true)
                .addField(`🕐 Clockspeed`, speed + " GHz", true)
                .addField(`💾 Memory Usage`, Math.trunc(ram) + "GB / " + Math.trunc(os.totalmem() / 1024 / 1000000) + "GB", true)
                .addField(`:clock9: Uptime`, uptime, true)
                .addField(`💻 CPU Usage`, cpuUsage + "%", true)
                .addField(`OS Type`, os.type(), true)
                .addField(`🔽 Current Shard`, shardID + 1, true)
                .addField(`💠 Total Shards`, shardCount, true)
                .addField(`📖 Library`, `Discord.JS 11.3.1`, true)
                .setTimestamp()
                .setAuthor(bot.user.username, bot.user.avatarURL);
            message.channel.send(emb);
        } else {
            message.channel.send(emb);
        }

    },
};
