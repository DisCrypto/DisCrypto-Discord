const Discord = require('discord.js');
const snekfetch = require('snekfetch');

String.prototype.truncate = function(){
    let re = this.match(/^.{0,4}[\S]*/);
    let l = re[0].length;
    re = re[0].replace(/\s$/,'');
    if(l < this.length)
        re = re + "&hellip;";
    return re;
};

function addCommas(x) {
    if (!x) {
        return "N/A";
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

module.exports = {
    name: 'flippening',
    type: 'core',
    usage: 'flippening',
    permission: 1,
    help: 'Check flippening status.',
    main: async function (client, message) {
        snekfetch.get(`https://api.coinmarketcap.com/v1/ticker/?limit=2`).then(res => {
            let percent = parseInt(((res.body[1].market_cap_usd / res.body[0].market_cap_usd) * 100).toString().truncate(4));
            console.log((res.body[0].market_cap_usd / res.body[0].market_cap_usd));
            let emb = new Discord.RichEmbed()
                .setTitle(`ETH/BTC Flippening`)
                .setDescription(`The Flippening is where Ethereum overtakes Bitcoin as #1 in Market Cap. \n \nCurrently Ethereum is **${percent}%** along the way to overtaking BTC.\n\nEthereum Market Cap: **$${addCommas(res.body[1].market_cap_usd)}**\n\nBitcoin Market Cap: **$${addCommas(res.body[0].market_cap_usd)}**`)
                .setColor(`ORANGE`)
                .attachFile(`./data/icons/flippening.jpg`)
                .setThumbnail(`attachment://flippening.jpg`);
            message.channel.send(emb);
        });
    },
};
