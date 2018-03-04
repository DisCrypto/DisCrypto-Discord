const Discord = require('discord.js');
const bitcoin = require('bitcoinjs-lib');
const etherwallet = require('ethers').Wallet;
const ripple = require('ripple-wallet');
const bch = require('bitcore-lib-cash');

module.exports = {
    name: 'genwallet',
    type: 'core',
    usage: 'genwallet (BTC/ETH/LTC/XRP/BCH)',
    permission: 1,
    help: 'Learn about a coin!',
    main: async function (bot, message) {
        if (message.args.length < 1) {
            await message.channel.send(`Invalid arguments!`);
            return;
        } else {
            let ticker = bot.getTicker(message.args[0]);
            if (ticker.ticker == "btc") {
                message.react('👍');
                let keyPair = bitcoin.ECPair.makeRandom();
                let address = keyPair.getAddress();
                let privKey = keyPair.toWIF();
                let emb = new Discord.RichEmbed()
                    .setTitle(`New Bitcoin Address`)
                    .attachFile(`./data/icons/btc.png`)
                    .setThumbnail(`attachment://btc.png`)
                    .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                    .addField(`PUBLIC KEY (send to this address)`, address)
                    .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
                message.author.send(emb);
            } else if (ticker.ticker == "eth") {
                message.react('👍');
                let wallet = etherwallet.createRandom();
                let address = wallet.address;
                let privKey = wallet.privateKey;
                let emb = new Discord.RichEmbed()
                    .setTitle(`New Ethereum Address`)
                    .attachFile(`./data/icons/eth.png`)
                    .setThumbnail(`attachment://eth.png`)
                    .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                    .addField(`PUBLIC KEY (send to this address)`, address)
                    .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
                message.author.send(emb);
            } else if (ticker.ticker == "ltc") {
                message.react('👍');
                let litecoin = bitcoin.networks.litecoin;
                let keyPair = bitcoin.ECPair.makeRandom({ network: litecoin});
                let address = keyPair.getAddress();
                let privKey = keyPair.toWIF();
                let emb = new Discord.RichEmbed()
                    .setTitle(`New Litecoin Address`)
                    .attachFile(`./data/icons/ltc.png`)
                    .setThumbnail(`attachment://ltc.png`)
                    .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                    .addField(`PUBLIC KEY (send to this address)`, address)
                    .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
                message.author.send(emb);
            } else if (ticker.ticker == "bch") {
                message.react('👍');
                let privKey = new bch.PrivateKey();
                let address = privKey.toAddress();
                let emb = new Discord.RichEmbed()
                    .setTitle(`New Bitcoin Cash Address`)
                    .attachFile(`./data/icons/bch.png`)
                    .setThumbnail(`attachment://bch.png`)
                    .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                    .addField(`PUBLIC KEY (send to this address)`, address)
                    .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
                message.author.send(emb);
            } else if (ticker.ticker == "xrp") {
                message.react('👍');
                let wallet = ripple.generate();
                let address = wallet.address;
                let privKey = wallet.secret;
                let emb = new Discord.RichEmbed()
                    .setTitle(`New Ripple Address`)
                    .attachFile(`./data/icons/xrp.png`)
                    .setThumbnail(`attachment://xrp.png`)
                    .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                    .addField(`PUBLIC KEY (send to this address)`, address)
                    .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
                message.author.send(emb);
            } else {
                await message.channel.send(`We do not currently support that coin for wallet generation.`);
                return;
            }
        }
    }
};
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
