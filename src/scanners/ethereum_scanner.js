const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const web3 = require('web3');
const Web3util = new web3();
const EtherscanApiKey = require('../config/config.json').etherScanKey;
const InfuraApiKey = require('../config/config.json').infuraKey;

module.exports = {
    scanAndRender: async function (address, msg) {
        let addressType = this.determineAddressType(address);

        if (!addressType){ throw({ message: `Invalid address ${address}` });}

        let data = await this.scan(address, addressType);
        if (data.error) return Promise.reject({ message: `Scan went wrong` });

        data["address"] = address;
        data["addressType"] = addressType;

        this.render(msg, data);
    },
    scan: async function (address, addressType) {
        if (addressType === "account") {
            return this.getBalanceFromEthereumAddress(address).then(function(balance) {
                let ether = Web3util.utils.fromWei(balance.toString(), "ether");
                return Promise.resolve({ result: ether });
            });
        } else if (addressType === "transaction") {
            return this.getTransactionHashData(address).then(function(result) {
                let ether = Web3util.utils.fromWei(result["result"]["value"], "ether");
                let gasPrice = Web3util.utils.fromWei(result["result"]["gasPrice"], "ether")

                let transactionData = {
                    txHash: result["result"]["hash"],
                    blockNumber: parseInt(result["result"]["blockNumber"]),
                    value: ether,
                    from: result["result"]["from"],
                    to: result["result"]["to"],
                    gasPrice: gasPrice
                }

                return Promise.resolve({ result: transactionData });
            }).catch(function(err) {
                return Promise.resolve({ error: err });
            });
        }

    },


    determineAddressType: function (address) {
        if (address.length === 42) return "account";
        if (address.length === 66) return "transaction";

        return null;
    },

    /*
        data = {
            address: "",
            addressType: "account",
            result: "",
            error: ""
        }
    */
    render: function (msg, data) {
        let emb = new Discord.RichEmbed();

        switch(data.addressType) {
        case "account":
            // address given
            emb.setTitle(`Ethereum Address`)
                .setDescription(`Data for address ${data.address}:`)
                .addField(`Balance:`, data.result + " ETH")
                .setColor(`GREEN`);
            break;
        case "transaction":
            // transaction given
            emb.setTitle(`Ethereum Transaction`);
            if (data.error) {
                emb.setColor(`RED`)
                    .setDescription(`Failed transaction.`)
                    .addField(`Reason`, data.error);
            } else {
                let desc = `**TxHash**: ${data.result.txHash}\n` +
                           `**Block Number**: ${data.result.blockNumber}\n` +
                           `**Value**: ${data.result.value} Ether\n` +
                           `**From**: ${data.result.from}\n` +
                           `**To**: ${data.result.to}\n` +
                           `**Gas Price**: ${data.result.gasPrice} Ether\n`

                emb.setDescription(desc);

            }
            break;
        default:
        }

        emb.attachFile(`${srcRoot}/data/icons/eth.png`)
            .setThumbnail(`attachment://eth.png`);

        msg.channel.send(emb);
    },

    getBalanceFromEthereumAddress: function (address) {
        let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${EtherscanApiKey}`;
        return snekfetch.get(url).then(result => {
            let data = result.body;
            if (data.status == 1) {
                //OK

                let balance = parseInt(data.result);
                return Promise.resolve(balance);
            } else {
                return Promise.reject({});
            }
        });
    },

    getTransactionHashData: function (transactionHash) {
        let url = `https://api.infura.io/v1/jsonrpc/mainnet/eth_getTransactionByHash?params=[%22${transactionHash}%22]&token=${InfuraApiKey}`

        return snekfetch.get(url).then(result => {
            let data = result.body;
            if (result.status !== 200) {
                return Promise.reject("transaction not found");
            }

            return Promise.resolve(data);
        });
    }
};
