const snekfetch = require('snekfetch');
let fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data/coininfo.sqlite');

module.exports = {
    name: 'updatefile',
    type: 'owner',
    usage: 'updatefile',
    permission: 6,
    help: 'Updates tickers.json .',
    main: function(bot, msg) {
        try {
            /*      snekfetch.get(`https://api.coinmarketcap.com/v1/ticker/?limit=0`).then(r => {
                let obj = {};
                r.body.forEach(r2 => {
                    obj[r2.symbol.toLowerCase()] = r2.id;
                });
                fs.writeFileSync('./data/tickers.json', JSON.stringify(obj, null, 2), 'utf-8');
                msg.reply(`Updated file!`);
                return null;
            });*/
            const tickers = Object.values(require(`../data/tickers.json`));
            //tickers.forEach((val) => {
            request(`https://coinmarketcap.com/currencies/bitcoin`, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    $('ul.list-unstyled a').each(function(){
                        console.log(`Inserted ${(this).text()} as ${$(this).attr("href")}`);
                        db.run(`INSERT INTO btc VALUES (${(this).text()}, ${$(this).attr("href")})`);
                    });
                } else {
                    console.log(error);
                }
            });
            //  });
        } catch (e) {
            console.error(e);
        }
    },
};
