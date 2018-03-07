const snekfetch = require('snekfetch');
const Promise = require('es6-promise');
const Discord = require('discord.js');
const web3 = require('web3');
const Web3util = new web3();
const EtherscanApiKey = require('../config.json').etherScanKey;

module.exports = {
    name: 'scan',
    type: 'all',
    usage: 'scan [address|txid|blockid] [coin]',
    permission: 1,
    help: 'Scan a address, txid, or blockid.',
    main: async function(bot, msg) {
        if (msg.args.length < 0) {
            msg.channel.send(`Please include a address/txid/blockid! Many coins are supported.`);
        } else {
            getDataFromAddr(msg.args, bot).then(res => {
                if (!res){ msg.channel.send(`There was an error fetching your address/txid/block. Perhaps it doesn't exist.`); return;}
                let emb = new Discord.RichEmbed();
                if (res.ticker.ticker == "btc") {
                    true;
                } else if (res.ticker.ticker == "eth") {
                    if (res.type == 0) {
                        emb.setTitle(`Ethereum Address`)
                            .setDescription(`Data for address ${msg.args[0]}:`)
                            .addField(`Balance:`, Web3util.utils.fromWei(res.data.balance.toString()))
                            .setColor(`GREEN`);
                    }
                    else if (res.type == 1){
                        emb.setTitle(`Ethereum Transaction`);
                        if (res.data.result) {
                            emb.setColor(`GREEN`)
                                .setDescription(`Successful transaction.`);
                        } else {
                            //tx err
                            emb.setColor(`RED`)
                                .setDescription(`Failed transaction.`)
                                .addField(`Reason`, res.data.reason);
                        }
                    } else if (res.type == 2) {
                        emb.setTitle(`Ethereum block no. ${msg.args[0]}`)
                            .setColor(`GREEN`)
                            .addField(`Miner`, res.data.miner)
                            .addField(`Reward`, res.data.reward)
                            .addField(`Mined At`, res.data.timestamp);
                    }
                    emb.attachFile(`./data/icons/eth.png`)
                        .setThumbnail(`attachment://eth.png`);
                    msg.channel.send(emb);

                }
            }).catch(console.error);
        }
    }
};

async function getDataFromAddr (args, bot) {
    if (!args) return;
    let arg = args[0];
    let prefix = arg.slice(0, 2);
    let ticker = await bot.getTicker(args[1]);
    console.log(!isNaN(parseInt(arg)) && ticker.name == "ethereum");
    //first check for BTC variants
    return new Promise((res, rej) => {
        let obj = {
            type: false, //false for address, true for txid
            ticker: {ticker: "", name:""},
            addrtype: "",
            data: {}
        };
        if (prefix.startsWith(`1`) || prefix.startsWith(`3`)) {
            //do api stuff
            obj.data = 0;
            obj.ticker = {ticker: "btc", name: "bitcoin"};

            //narrow it down

            prefix = prefix.slice(0);
            if (prefix == '1') {
                obj.addrtype = "normal";
            } else if (prefix == '3') {
                obj.addrtype = "P2SH/Segwit";
            }
        } else if (prefix.startsWith(`0x`) || ticker.name == "ethereum") {
            obj.ticker = {ticker: "eth", name: "ethereum"};
            obj.addrtype = "normal"; //FOR NOW
            if (arg.length == 42) {
            //address
                obj.type = 0;
                let url = `https://api.etherscan.io/api?module=account&action=balance&address=${arg}&tag=latest&apikey=${EtherscanApiKey}`;
                snekfetch.get(url).then(result => {
                    let data = result.body;
                    if (data.status == 1) {
                        //OK

                        obj.data.balance = parseInt(data.result);
                        res(obj); //add fromWei later
                    } else {
                        res(false);
                    }
                });
            } else if (arg.length == 66) {
            //txid
                obj.type = 1;
                let url = `https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${arg}&tag=latest&apikey=${EtherscanApiKey}`;
                snekfetch.get(url).then(result => {
                    let data = result.body;
                    if (data.result.isError == 0) {
                    //OK
                        obj.data.result = true; //add fromWei later
                        res(obj);
                    } else {
                        obj.data.result = false;
                        obj.data.reason = data.result.errDescription;
                        res(obj);

                    }
                });
            } else if (!isNaN(parseInt(arg)) && ticker.name == "ethereum") {
                let n = parseInt(arg);
                if (n < 0) {
                    res(false);
                } else {
                    obj.type = 2;
                    //valid blockid
                    let url = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${args[0]}&tag=latest&apikey=${EtherscanApiKey}`;
                    console.log(url);
                    snekfetch.get(url).then(result => {
                        let data = result.body;
                        console.log(data);
                        if (data.status == 1) {
                        //OK
                            obj.data.result = true; //add fromWei later
                            obj.data.timestamp = new Date(data.result.timeStamp * 1000).toUTCString();
                            obj.data.miner = data.result.blockMiner;
                            obj.data.reward = data.result.blockReward;
                            res(obj);
                        } else {
                            obj.data.result = false;
                            res(obj);
                        }
                    });
                }
            } else {
                console.log(`n`);
                console.log(isNaN(parseInt(arg)) || ticker.name != "ethereum");
            }
        } else {
            rej(`invalid coin ${args[0]}`);
        }
    });
}
