const Discord = require('discord.js');
const snekfetch = require('snekfetch');

let helper = {};
require('./../funcs')(helper);

module.exports = {
    name: 'top',
    type: 'core',
    usage: "top [count]",
    example: "top 20",
    permission: 1,
    help: 'See the top cryptos by market cap. Limit results by passing count value. Max count is 25.',
    main: function (bot, message) {
        if (message.args.length < 1) {
            return helper.showUsage(this, message);
        }
        let amount = parseInt(message.args[0]);
        let first = "usd";
        if (message.args[1]) {
            first = bot.getTicker(message.args[1].toLowerCase());
        }
        if (first.failure) {
            message.channel.send(`Invalid coin, make sure it a valid ticker, name, or the words usd/fiat!`);
            return;
        }
        else if (amount == 0 || !amount || amount > 25 || amount < 0) {
            message.channel.send(`Invalid amount, make sure it is not a float (0.X) and less than 25!`);
            return;
        }
        snekfetch.get(`https://api.coinmarketcap.com/v1/ticker/?limit=${amount}&convert=${first}`).then(r => {
            let data = r.body;
            let emb = new Discord.RichEmbed();
            emb.setTitle(`Top ${amount} Coins By Market Cap`)
                .setColor(`#00FF00`);
            let text = `\n\n`;
            let total = 0;
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                total = total + parseInt(d.market_cap_usd);
                let graph = ((d.percent_change_24h.indexOf("-") > -1) ?  '📉' : '📈');
                text = text + `\n**${d.symbol}:** | **$${d.price_usd}** | **${d.percent_change_24h}%** | ${graph}`;
            }
            text += `\n\n**Total Market Cap of These Coins: ** $${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            emb.setDescription(text);
            message.channel.send(emb);
        });
    }
};
