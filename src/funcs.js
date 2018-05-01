const isTravisBuild = process.argv[2] && process.argv[2] === '--travis';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(srcRoot + '/data/servers.sqlite');
const fs = require('fs');
const unirest = require('unirest');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');

const config = isTravisBuild ? require('./config/config-example.json') : require('./config/config.json');

module.exports = bot => {
    /**
     * Server Related Functions
     */

    bot.sendServerCount = function() {
        if (bot.config.dbotspw) {
            let guilds;
            if (bot.shard) {
                bot.shard.fetchClientValues('guilds.size').then(g => {
                    guilds = g.reduce((prev, val) => prev + val, 0);
                }).catch(bot.error);
            } else {
                guilds = bot.guilds.size;
            }

            unirest.post('https://bots.discord.pw/api/bots/' + bot.user.id + '/stats')
                .headers({
                    Authorization: bot.config.dbotspw,
                    'Content-Type': 'application/json',
                })
                .send({
                    server_count: guilds,
                })
                .end(response => {
                    bot.log(response.body);
                });
            bot.log('All server counts posted successfully!');
        }
    };

    bot.syncServers = function() {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS servers (id VARCHAR(25) PRIMARY KEY,prefix VARCHAR(10))");
            bot.guilds.forEach(guild => {
                try {
                    if (guild.channels.array() && guild.channels.array()[0]) {
                        db.run("INSERT OR IGNORE INTO servers VALUES (?,?)",
                            guild.id,
                            config.prefix);
                    } else {
                        db.run("INSERT OR IGNORE INTO servers VALUES (?,?)",
                            guild.id,
                            config.prefix);
                    }
                } catch (err) {
                    bot.log(err.stack);
                }
            });
        });
        bot.log('Servers synced.');
        return "completed";
    };

    bot.removeServer = function(guild) {
        db.run("DELETE FROM servers WHERE id = ?", guild.id);
        bot.log(guild.name + ' successfully removed from the database!');
    };

    bot.addServer = function(guild) {
        db.run("INSERT OR IGNORE INTO servers VALUES (?,?)",
            guild.id,
            bot.config.prefix);
        bot.log(guild.name + ' successfully inserted into the database!');
    };



    bot.getPrefix = function(msg) {
        return new Promise(
            (resolve, reject) => {
                if (!msg.guild) resolve('%');
                db.get(`SELECT * FROM servers WHERE id = "${msg.guild.id}"`, (err, row) => {
                    if (err || !row) reject(err);
                    else resolve(row.prefix);
                });
            }
        );
    };

    bot.setPrefix = function(prefix, guild) {
        db.run("UPDATE servers SET prefix = ? WHERE id = ? ", prefix, guild.id);
        return prefix;
    };

    bot.showUsage = async function(command, msg) {
        let prefix = await this.getPrefix(msg);
        if (command.name === "$") prefix = "";

        let emb = new Discord.RichEmbed();

        emb.addField(prefix + command.usage, command.help);
        emb.addField("Usage", prefix + command.example);

        emb.setColor(`GOLD`);

        msg.channel.send(emb);
        return;
    };

    bot.setPrefix = function(prefix, guild) {
        db.run('UPDATE servers SET prefix = "' + prefix + '" WHERE id = ' + guild.id);
        return prefix;
    };
    /**
	 * Core message processing functions
	 */

    // Implement categories of commands and check this based on those
    bot.enabled = function(command, guild) {
        if (command || guild) {
            return true;
        } else {
            return false;
        }
    };

    bot.permLevel = function(msg) {
        const author = msg.author;
        const guild = msg.guild;

        if (bot.config.owner.indexOf(msg.author.id) > -1) {
            return 6;
        }

        if (msg.channel.type == 'dm') return 5;

        if (author && guild && guild.owner && author.id === guild.owner.id) {
            return 5;
        } else if (msg.member.hasPermission('MANAGE_GUILD')) {
            return 4;
        } else if (msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            return 3;
        } else if (msg.member.hasPermission('MANAGE_MESSAGES')) {
            return 2;
        } else {
            return 1;
        }
    };

    bot.getTicker = function (ticker) {
        let data = require('./data/tickers.json');
        let keys = Object.keys(data);
        let values = Object.values(data);
        let isTickerNameProvided = values.indexOf(ticker) > -1;

        if (isTickerNameProvided) {
            return {"ticker": keys[values.indexOf(ticker)], "name": ticker};
        } else if (data[ticker]) {
            return {"ticker": ticker, "name": data[ticker]};
        } else {
            return {"failed": true};
        }
    };

    /**
	 * Core bot functions
	 */

    bot.send = function(channel2, text) {
        var color = channel2.guild.me.displayHexColor || '#ffb200';
        channel2.send(new Discord.RichEmbed().setColor(color).setDescription(text)
            .setFooter(bot.user.username, bot.user.avatarURL));
    };

    bot.startGameCycle = async function() {
        async function getRand(count) {
            return snekfetch.get(`http://api.coinmarketcap.com/v1/ticker/?start=${Math.round(Math.random() * 10) * count}&limit=1`);
        }
        let c = await getRand(2).catch(err => {bot.error(err); return;});
        let data = c.body[0];
        bot.user.setPresence({
            game: {
                name: `${data.symbol} $${data.price_usd} | @DisCrypto help`,
                type: 3,
            },
        });
        setInterval(async () => {
            let c = await getRand(2).catch(err => {bot.error(err); return;});
            let data = c.body[0];
            bot.user.setPresence({
                game: {
                    name: `${data.symbol} $${data.price_usd}`,
                    type: 3,
                },
            });
        }, 600000);
    };

    bot.webhook = function(header, text, color) {
        var request = require('request');
        try {
            var d = {
                attachments: [{
                    color: color,
                    fields: [{
                        title: header,
                        value: text,
                    }],
                    ts: new Date() / 1000,
                }],
            };
            if (config.webhook) {
                request({
                    url: config.webhook + '/slack',
                    method: 'POST',
                    body: d,
                    json: true,
                });
            }
        } catch (err) {
            bot.error(err);
        }
    };

    bot.joinleavehook = function(type, guild) {
        var request = require('request');
        bot.fetchGuildSize().then(guilds => {
            try {
                if (type === 'join') {
                    var color = '#FFB200';
                    var title = ':inbox_tray: New Guild! | Now in ' + guilds + ' guilds.';
                } else if (type === 'leave') {
                    color = '#FF0000';
                    title = ':outbox_tray: Left Guild | Now in ' + guilds + ' guilds.';
                }

                var members = 0,
                    bots = 0;
                guild.members.forEach(member => {
                    if (member.user.bot) {
                        bots++;
                    } else {
                        members++;
                    }
                });

                var d = {
                    attachments: [{
                        color: color,
                        title: title,
                        thumb_url: guild.iconURL,
                        fields: [{
                            title: 'Server Name',
                            value: guild.name,
                            short: true,
                        }, {
                            title: 'Created',
                            value: guild.createdAt.toLocaleString(),
                            short: true,
                        }, {
                            title: 'ID',
                            value: guild.id,
                            short: true,
                        }, {
                            title: 'Owner',
                            value: guild.owner.user.username,
                            short: true,
                        }, {
                            title: 'Member Count',
                            value: members,
                            short: true,
                        }, {
                            title: 'Bot Count',
                            value: bots,
                            short: true,
                        }],
                        footer: bot.user.username,
                        ts: new Date() / 1000,
                    }],
                };

                if (guild.features[0]) {
                    d.attachments[0].fields.push({
                        title: 'Features',
                        value: guild.features.join('\n'),
                    });
                    d.attachments[0].text = 'Partnered Server';

                    if (guild.features.includes('INVITE_SPLASH')) { d.attachments[0].image_url = guild.splashURL + '?size=2048'; }
                }
                if (config.logwebhook) {
                    request({
                        url: config.logwebhook + '/slack',
                        method: 'POST',
                        body: d,
                        json: true,
                    });
                }
            } catch (err) {
                bot.error(err);
            }
        });
    };

    /**
	 * Logging functions
	 */

    bot.logCommand = function(command, args, user, channel2, server) {
        bot.webhook('Command Executed', `**Command:** ${command}\n**User:** ${user}\n**Arguments:** ${args}\n**Server:** ${server}\n**Channel:** #${channel2}`, '#0000FF');
    };

    bot.error = function(err) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [ERROR] | ' + err.stack);
            bot.webhook('ERROR', '[SHARD ' + bot.shard.id + '] [ERROR] | ' + err.stack, '#FF0000');
        } else {
            console.log(this.timestamp() + ' [ERROR] | ' + err.stack);
            bot.webhook('ERROR', '[ERROR] | ' + err.stack, '#FF0000');
        }
    };

    bot.debug = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [DEBUG] | ' + txt);
        } else {
            console.log(this.timestamp() + ' [DEBUG] | ' + txt);
        }
    };

    bot.warn = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [WARN]  | ' + txt);
            bot.webhook('Warning', ' [SHARD ' + bot.shard.id + '] [WARN]  | ' + txt, '#FFFF00');
        } else {
            console.log(this.timestamp() + ' [WARN]  | ' + txt);
            bot.webhook('Warning', '[WARN]  | ' + txt, '#FFFF00');
        }
    };

    bot.log = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + ']  [LOG]  | ' + txt);
            bot.webhook('Log', '[SHARD ' + bot.shard.id + '] ' + txt, '#000000');
        } else {
            console.log(this.timestamp() + '  [LOG]  | ' + txt);
            bot.webhook('Log', txt, '#000000');
        }
    };

    bot.timestamp = function() {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds();
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        return '[' + hours + ':' + minutes + ':' + seconds + ']';
    };

    /**
	 * Utility functions for information retrieval
	 */

    bot.displayServer = function(msg, serverID) {
        db.run("SELECT * FROM servers WHERE id = ?", serverID, (err, row) => {
            if (err) {
                msg.channel.send(err);
            } else {
                msg.channel.send(JSON.stringify(row));
            }
        });
    };
};
