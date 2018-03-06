const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = async function(msg, bot, channel) {
    if (channel && msg.channel.id === channel) bot.log(msg.guild.name + ' | ' + msg.channel.name + ' | ' + msg.member.displayName + ' | ' + msg.cleanContent);

    if (msg.author.bot) return;


    function jsUcfirst(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function addCommas(x) {
        if (!x) {
            return "N/A";
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    if (msg.isMentioned(bot.user)) {
        if (msg.content.toLowerCase().includes("what's your prefix") || msg.content.toLowerCase().includes('whats your prefix')) {
            bot.getPrefix(msg).then(prefix => {
                msg.reply('my prefix for this server is `' + prefix + '`!');
            });
        }

        if (msg.content.toLowerCase().includes('resetprefix') && msg.member.hasPermission('ADMINISTRATOR')) {
            bot.setPrefix(bot.config.prefix, msg.guild);
            msg.reply('I have reset this server\'s prefix to ``' + bot.config.prefix + '``!');
        }
    }

    else if (msg.content.startsWith(`$`)) {
        try {
            msg.args = msg.content.split(/\s+/g);
            let newT = msg.args.shift().slice(1).toLowerCase();
            let t = this.getTicker(newT);
            if (!t.ticker) {
                return;
            }
            snekfetch.get(`https://api.coinmarketcap.com/v1/ticker/${t.name}?convert=ETH&limit=1`).then(json => {
                let data = json.body[0];
                let color = (data.percent_change_24h.indexOf("-") > -1) ? "#FF0000" : "#00FF00";

                let text = `\n**Market Cap Rank:** ${data.rank}\n\n**Price USD:** $${data.price_usd}\n**Price BTC:** ${data.price_btc} BTC\n**Price ETH:** ${data.price_eth} ETH`;
                text += `\n\n**Total Market Cap:** $${addCommas(data.market_cap_usd)}\n**24hr Volume:**         $${addCommas(data['24h_volume_usd'])}\n**Total Supply:**          ${addCommas(data.total_supply)} ${t.ticker.toUpperCase()}`;
                text += `\n\n**Change 1h:**     ${data['percent_change_1h']}%\n**Change 24hr:**   ${data['percent_change_24h']}%\n**Change 1 week**:     ${data['percent_change_7d']}%`;
                let emb = new Discord.RichEmbed()
                    .setTitle(`Price of ${jsUcfirst(t.name)} [${t.ticker.toUpperCase()}]`)
                    .setURL(`https://coinmarketcap.com/currencies/${t.name}`)
                    .setColor(color)
                    .attachFile(`./data/icons/${t.ticker}.png`)
                    .setThumbnail(`attachment://${t.ticker}.png`)
                    .setFooter(`discrypto.xyz | @DisCrypto what's your prefix?`)
                    .setDescription(text);
                msg.channel.send(emb);
                return;
            });
        } catch (e) {
            console.error(e);
        }
    } else {
        this.getPrefix(msg).then(prefix => {
            if (msg.content.startsWith(prefix)) {
                try {
                    msg.args = msg.content.split(/\s+/g);
                    msg.content = msg.content.substring(msg.content.indexOf(' ') + 1, msg.content.length) || null;
                    var command = msg.args.shift().slice(prefix.length).toLowerCase();
                    var cmd = bot.commands.get(command);
                    // || bot.commands.get(bot.aliases.get(command))
                    var perms = bot.permLevel(msg);

                    if (!cmd) {
                        return;
                    } else if (perms === 0) {
                        msg.reply('you are blacklisted from using the bot!');
                    } else if (perms < cmd.permission) {
                        msg.reply('you do not have permission to do this!');
                    } else if (bot.enabled(cmd)) {
                        bot.logCommand(command, msg.content, msg.author.username, msg.channel.name, msg.guild.name);
                        try {
                            cmd.main(bot, msg);
                        } catch (err) {
                            msg.channel.send('Oh no! We encountered an error! Join our support server https://discord.gg/Xg5V8mn if it persists.');
                        }
                    }
                } catch (err) {
                    msg.channel.send('Oh no! We encountered an error! Join our support server https://discord.gg/Xg5V8mn if it persists.');
                    bot.error(err.stack);
                }
            }
        });
    }
};
