const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    name: 'convert',
    type: 'core',
    usage: 'convert (amount) (from) (to)',
    permission: 1,
    help: 'Convert one crypto amount to another.',
    main: function (bot, message) {
        if (message.args.length < 3) {
            console.log(message.args.length);
            message.channel.send(`Invalid arguments!`);
            return;
        }
        let amount = parseFloat(message.args[0]);
        let first = bot.getTicker(message.args[1].toLowerCase());
        let second = bot.getTicker(message.args[2].toLowerCase());
        if (first.failed || second.failed || isNaN(amount)) {
            message.channel.send(`Invalid arguments!`);
            return;
        }
        snekfetch.get(`http://api.coinmarketcap.com/v1/ticker/${first.name.toLowerCase()}/?convert=${second.ticker.toLowerCase()}`).then(r => {
            let data = r.body[0];
            let conversion = data[`price_${second.ticker}`];
            let emb = new Discord.RichEmbed();
            emb.setTitle(`${first.ticker.toUpperCase()} to ${second.ticker.toUpperCase()}`)
                .setColor(`#00FF00`)
                .setDescription(`\n\n**${amount} ${jsUcfirst(first.name)}**\n\nis equal to\n\n**${amount * conversion} ${jsUcfirst(second.name)}**`);
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
