const Discord = require('discord.js');
const config = require('./config.json');
const Manager = new Discord.ShardingManager('./bot.js', { totalShards: config.shards, token: config.token });
Manager.spawn();
