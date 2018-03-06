const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');

let helper = {}
require('./../funcs')(helper);

let coinInfoJsonFile = "./data/coininfo.json"

if (!fs.existsSync(coinInfoJsonFile)) {
    console.log("\nMissing " + coinInfoJsonFile + " . Run `node ./scripts/scrape_coininfo.js` to populate json file.\n")
    process.exit(1)
}

const coinInfoMap = JSON.parse(fs.readFileSync(coinInfoJsonFile))

module.exports = {
    name: 'coininfo',
    type: 'core',
    usage: 'coininfo [symbol]',
    example: 'coininfo btc',
    permission: 1,
    help: 'Display important coin information such as their website, block explorers, forums ',
    main: async function (bot, message) {
        if (message.args.length < 1) {
            return helper.showUsage(this, message);
        } else {
            let ticker = bot.getTicker(message.args[0]);
            if (!ticker) {
                return helper.showUsage(this, message);
            } else {
                let coin = coinInfoMap[ticker.ticker]
                if (!coin) {
                    return message.channel.send(`coin information for \`${message.args[0]}\` is not supported yet`);
                }

                let emb = new Discord.RichEmbed();

                for (let fieldName in coin.data) {
                    let url = coin.data[fieldName]    
                    emb.addField(fieldName, url);
                }

                emb.setTitle(`Learn about ${jsUcfirst(ticker.name)}`)
                    .attachFile(`./data/icons/${ticker.ticker}.png`)
                    .setThumbnail(`attachment://${ticker.ticker}.png`)
                    .setAuthor(bot.user.username, bot.user.avatarURL);
                message.channel.send(emb);
            }
        }
    }
};
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
