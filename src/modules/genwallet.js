const Discord = require('discord.js');
const bitcoin = require('bitcoinjs-lib');
const etherwallet = require('ethers').Wallet;
const ripple = require('ripple-wallet');
const bch = require('bitcore-lib-cash');
const nanoJS = require('nano-lib');
const crypto = require('crypto');
let helper = {};
require('./../funcs')(helper);

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
            return helper.showUsage(this, message);
        } else {
            let ticker = bot.getTicker(message.args[0]);
            let emb = new Discord.RichEmbed()
                .setTitle(`New ${jsUcfirst(ticker.name)} Paper Wallet`)
                .attachFile(`./data/icons/${ticker.ticker}.png`)
                .setThumbnail(`attachment://${ticker.ticker}.png`)
                .setDescription(`KEEP YOUR PRIVATE KEY VERY SAFE!`)
                .setAuthor(bot.user.username, bot.user.avatarURL);
            let {address, privKey} = await new Promise(async (res) => { 
                if (ticker.ticker == "btc") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    let keyPair = bitcoin.ECPair.makeRandom();
                    let address = keyPair.getAddress();
                    let privKey = keyPair.toWIF();
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "eth") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    let wallet = etherwallet.createRandom();
                    let address = wallet.address;
                    let privKey = wallet.privateKey;
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "ltc") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    let litecoin = bitcoin.networks.litecoin;
                    let keyPair = bitcoin.ECPair.makeRandom({ network: litecoin});
                    let address = keyPair.getAddress();
                    let privKey = keyPair.toWIF();
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "bch") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    let privKey = new bch.PrivateKey();
                    let address = privKey.toAddress();
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "xrp") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    let wallet = ripple.generate();
                    let address = wallet.address;
                    let privKey = wallet.secret;
                    res({address: address, privKey: privKey});
                } else if (ticker.ticker == "nano" || ticker.ticker == "xrb") {
                    message.channel.send(`Generating a ${jsUcfirst(ticker.name)} paper wallet..`);
                    crypto.randomBytes(32, (err, buf) => {
                        //console.log(buf);
                        let wallet = nanoJS.address.fromSeed(buf);
                        let address = wallet.address;
                        let privKey = wallet.secret;
                        res({address: address, privKey: privKey});
                    });
                } else {
                    await message.channel.send(`We do not currently support that coin for wallet generation.`);
                    return;
                }
            });
            emb.addField(`PUBLIC KEY (send to this address)`, address)
                .addField(`PRIVATE KEY (KEEP SECURE)`, privKey);
            message.author.send(emb);
        }
    }
};
