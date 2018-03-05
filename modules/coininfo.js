const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    name: 'coininfo',
    type: 'core',
    usage: 'coininfo [symbol]',
    example: 'coininfo btc',
    permission: 1,
    help: 'Display important coin information such as their website, block explorers, forums ',
    main: async function (bot, message) {
        if (message.args.length < 1) {
            await message.channel.send(`Invalid arguments!`);
            return;
        } else {
            let ticker = bot.getTicker(message.args[0]);
            if (!ticker) {
                await message.channel.send(`Invalid arguments!`);
                return;
            } else {
                request(`https://coinmarketcap.com/currencies/${ticker.name}`, function (error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        let emb = new Discord.RichEmbed();
                        $('ul.list-unstyled a').each(function(){
                            emb.addField($(this).text(), $(this).attr("href"));
                        });

                        emb.setTitle(`Learn about ${jsUcfirst(ticker.name)}`)
                            .attachFile(`./data/icons/${ticker.ticker}.png`)
                            .setThumbnail(`attachment://${ticker.ticker}.png`)
                            .setAuthor(bot.user.username, bot.user.avatarURL);
                        message.channel.send(emb);
                    } else {
                        message.channel.send("That is not a valid coin name or ticker.");
                    }
                });
            }
        }
    }
};
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
