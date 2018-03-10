const Discord = require('discord.js');
const config = require('./config/config.json');

const path = require('path');
global.srcRoot = path.resolve(__dirname);

const Manager = new Discord.ShardingManager(srcRoot + '/bot.js', { totalShards: config.shards, token: config.token });
Manager.spawn();
