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
            getDataFromAddr(msg.args[0]).then(res => {
                let emb = new Discord.RichEmbed();
                console.log(res);
                if (res.ticker.ticker == "btc") {

                } else if (res.ticker.ticker == "eth") {
                    if (!res.type) {
                        emb.setTitle(`Ethereum Address`)
                            .setDescription(`Data for address ${msg.args[0]}:`)
                            .addField(`Balance:`, Web3util.utils.fromWei(res.bal.toString()));
                    }
                    else {
                        emb.setTitle(`Ethereum Transaction`);
                    }
                    emb.attachFile(`./data/icons/eth.png`)
                        .setThumbnail(`attachment://eth.png`);
                    msg.channel.send(emb);

                }
            });

        }
    },
};

async function getDataFromAddr (arg) {
    let prefix = arg.slice(0, 2);


    //first check for BTC variants
    return new Promise((res) => {
        let obj = {
            type: false, //false for address, true for txid
            ticker: {ticker: "", name:""},
            addrtype: "",
            balance: 0
        };
        if (prefix.startsWith(`1`) || prefix.startsWith(`3`)) {
            //do api stuff
            obj.bal = 0;
            obj.ticker = {ticker: "btc", name: "bitcoin"};

            //narrow it down

            prefix = prefix.slice(0);
            if (prefix == '1') {
                obj.addrtype = "normal";
            } else if (prefix == '3') {
                obj.addrtype = "P2SH/Segwit";
            }
        } else if (prefix.startsWith(`0x`)) {
            obj.ticker = {ticker: "eth", name: "ethereum"};
            obj.addrtype = "normal2"; //FOR NOW
            if (arg.length == 42) {
            //address
                let url = `https://api.etherscan.io/api?module=account&action=balance&address=${arg}&tag=latest&apikey=${EtherscanApiKey}`;
                snekfetch.get(url).then(result => {
                    console.log(result.body);
                    let data = result.body;
                    if (data.status == 1) {
                        //OK
                        obj.bal = parseInt(data.result);
                        console.log(typeof res);
                        res(obj); //add fromWei later
                    } else {
                        res(false);
                    }
                });
            } else if (arg.length == 66) {
            //txid
                let url = `https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${arg}&tag=latest&apikey=${EtherscanApiKey}`;
                snekfetch.get(url).then(res => {
                    console.log(res.body);
                    let data = res.body;
                    if (data.status == 1) {
                    //OK
                        obj.type = 1;
                        obj.bal = true; //add fromWei later
                        res(obj);
                    } else {
                        obj.type = 1;
                        obj.bal = false;
                        obj.bal.reason = data.result.errDescription;
                        res(obj);
                    }
                });
            } else if (!isNaN(parseInt(arg))) {
                let n = parseInt(arg);
                if (n < 0 || n > 7000000) {
                    res(false);
                } else {
                    //valid blockid

                }
            }
        }
        console.log(obj);
    });
}
