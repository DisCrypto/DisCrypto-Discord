const Discord = require('discord.js');
const bitcoin = require('bitcoinjs-lib');
const etherwallet = require('ethers').Wallet;
const ripple = require('ripple-wallet');
const bch = require('bitcore-lib-cash');
const nanoJS = require('nano-lib');
const crypto = require('crypto');

function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: 'genwallet',
    type: 'core',
    usage: 'genwallet [symbol]',
    example: 'genwallet eth',
    permission: 1,
    help: 'Create a paper wallet where keys will be sent via Direct Message. Only supports BTC/ETH/LTC/XRP/BCH/XRB currently',
    main: async function (bot, message) {
        if (message.args.length < 1) {
            return bot.showUsage(this, message);
        } else {
            let ticker = bot.getTicker(message.args[0].toLowerCase());
            if (ticker.failed) return message.channel.send(`We do not currently support that coin for wallet generation.`);
            let m = message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
            let emb = new Discord.RichEmbed()
                .setTitle(`New ${jsUcfirst(ticker.name)} Paper Wallet`)
                .attachFile(`${srcRoot}/data/icons/${ticker.ticker}.png`)
                .setThumbnail(`attachment://${ticker.ticker}.png`)
                .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                .setAuthor(bot.user.username, bot.user.avatarURL);
            let {address, privKey} = await new Promise(async (res) => {
                if (ticker.ticker == "btc") {
                    let keyPair = bitcoin.ECPair.makeRandom();
                    let address = keyPair.getAddress();
                    let privKey = keyPair.toWIF();
                    emb.setColor(`GOLD`);
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "eth") {
                    let wallet = etherwallet.createRandom();
                    let address = wallet.address;
                    let privKey = wallet.privateKey;
                    emb.setColor(`DARK_GREY`);
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "ltc") {
                    let litecoin = bitcoin.networks.litecoin;
                    let keyPair = bitcoin.ECPair.makeRandom({ network: litecoin});
                    let address = keyPair.getAddress();
                    let privKey = keyPair.toWIF();
                    emb.setColor(`LIGHT_GREY`);
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "bch") {
                    let privKey = new bch.PrivateKey();
                    let address = privKey.toAddress();
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "xrp") {
                    let wallet = ripple.generate();
                    let address = wallet.address;
                    let privKey = wallet.secret;
                    emb.setColor(`DARK_NAVY`);
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "nano" || ticker.ticker == "xrb") {
                    crypto.randomBytes(32, (err, buf) => {
                        let wallet = nanoJS.address.fromSeed(buf);
                        let address = wallet.address;
                        let privKey = wallet.secret;
                        emb.setColor(`AQUA`);
                        res({address: address, privKey: privKey});
                    });
                } else {
                    await message.channel.send(`We do not currently support that coin for wallet generation.`);
                    return;
                }
            });
            emb.addField(`PUBLIC KEY (send to this address)`, address)
                .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
            message.author.send(emb).then(() => m.edit(`Generated new ${ticker.ticker.toUpperCase()} paper wallet and sent it in DM.`));
        }
    }
};
