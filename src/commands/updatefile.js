const snekfetch = require('snekfetch');
var fs = require('fs');
module.exports = {
    name: 'updatefile',
    type: 'owner',
    usage: 'updatefile',
    permission: 6,
    help: 'Updates tickers.json .',
    main: function(bot, msg) {
        snekfetch.get(`https://api.coinmarketcap.com/v1/ticker/?limit=0`).then(r => {
            let obj = {};
            r.body.forEach(r2 => {
                obj[r2.symbol.toLowerCase()] = r2.id;
            });
            fs.writeFileSync('./data/tickers.json', JSON.stringify(obj, null, 2), 'utf-8');
            msg.reply(`Updated file!`);
            return null;
        });
    },
};
