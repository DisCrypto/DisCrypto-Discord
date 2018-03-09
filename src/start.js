const Discord = require('discord.js');
<<<<<<< HEAD
const config = require('./config.json');
const Manager = new Discord.ShardingManager('./bot.js', { totalShards: config.shards, token: config.token });
=======
const config = require('./config/config.json');
const Manager = new Discord.ShardingManager('./src/bot.js', { totalShards: config.shards, token: config.token });
>>>>>>> 2bbbf7a2186205281e0f033ae626f5bf7e74d28d
Manager.spawn();

Manager.on('message', (shard, msg) => {
    console.log('[' + shard.id + 1 + '] ' + msg);
});
