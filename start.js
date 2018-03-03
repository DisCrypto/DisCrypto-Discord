const Discord = require('discord.js');
const config = require('./config.json');
const Manager = new Discord.ShardingManager('./bot.js', { totalShards: 1, token: config.token });
Manager.spawn();

Manager.on('message', (shard, msg) => {
    console.log('[' + shard.id + 1 + '] ' + msg);
});
