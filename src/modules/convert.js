const Discord = require('discord.js');
const snekfetch = require('snekfetch');

let helper = {}
require('./../funcs')(helper);

module.exports = {
    name: 'convert',
    type: 'core',
    usage: 'convert [amount] [from_symbol] [to_symbol]',
    example: 'convert 100 btc lsk',
    permission: 1,
    help: 'Convert currency from one to another. Specific amounts must be given.',
    main: function (bot, message) {
        if (message.args.length < 3) {
            console.log(message.args.length);
            return helper.showUsage(this, message);
        }
        let amount = parseFloat(message.args[0]);
        let first = bot.getTicker(message.args[1].toLowerCase());
        let second = bot.getTicker(message.args[2].toLowerCase());
        if (first.failed || second.failed || isNaN(amount)) {
            return helper.showUsage(this, message);
        }
        snekfetch.get(`http://api.coinmarketcap.com/v1/ticker/${first.name.toLowerCase()}/?convert=${second.ticker.toLowerCase()}`).then(r => {
            let data = r.body[0];
            let conversion = data[`price_${second.ticker}`];
            let emb = new Discord.RichEmbed()
                .setTitle(`${first.ticker.toUpperCase()} to ${second.ticker.toUpperCase()}`)
                .setColor(`#00FF00`)
                .setDescription(`\n\n**${amount} ${jsUcfirst(first.name)}**\n\nis equal to\n\n**${amount * conversion} ${jsUcfirst(second.name)}**`)
                .setAuthor(bot.user.username, bot.user.avatarURL);
            message.channel.send(emb);
        })
            .catch(err => {
                message.channel.send(`Oh no! We had an error! Try again!`);
                console.error(err);
            });
    }
};
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
