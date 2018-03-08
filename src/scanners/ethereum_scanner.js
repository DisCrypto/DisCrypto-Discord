const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const Promise = require('es6-promise');
const web3 = require('web3');
const Web3util = new web3();
const EtherscanApiKey = require('../config/config.json').etherScanKey;

module.exports = {
    scanAndRender: async function(address, msg) {
        let addressType = this.determineAddressType(address);
        if (!addressType) throw({ message: `Invalid address ${address}` });

        let data = await this.scan(address, addressType);

        data["address"] = address;
        data["addressType"] = addressType;

        this.render(msg, data)
    },

    scan: async function(address, addressType) {
        if (addressType === "account") {
            let balance = await this.getBalanceFromEthereumAddress(address)
            let ether = Web3util.utils.fromWei(balance.toString(), "ether");
            return { result: ether }
        } else if (addressType === "transaction") {
            try {
                let result = this.getTransactionHashData(address)
                return { result: result }
            } catch(err) {
                return { error: err }
            }
        }

    },
            

    determineAddressType: function(address) {
        if (address.length === 42) return "account"
        if (address.length === 66) return "transaction"

        return null
    },

    /*
        data = {
            address: "",
            addressType: "account",
            result: "",
            error: ""
        }
    */
    render: function(msg, data) {
        let emb = new Discord.RichEmbed()

        switch(data.addressType) {
            case "account": 
                // address given
                emb.setTitle(`Ethereum Address`)
                    .setDescription(`Data for address ${data.address}:`)
                    .addField(`Balance:`, data.result)
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
                    emb.setColor(`GREEN`)
                        .setDescription(`Successful transaction.`);
                }
                break;
            default:
        }

        emb.attachFile(`${srcRoot}/data/icons/eth.png`)
            .setThumbnail(`attachment://eth.png`);

        msg.channel.send(emb);
    },

    getBalanceFromEthereumAddress: function(address) {
        let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${EtherscanApiKey}`;
        return snekfetch.get(url).then(result => {
            let data = result.body;
            if (data.status == 1) {
                //OK

                balance = parseInt(data.result);
                return Promise.resolve(balance)
            } else {
                return Promise.reject({})
            }
        });
    },

    getTransactionHashData: function(transactionHash) {
        let url = `https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${transactionHash}&tag=latest&apikey=${EtherscanApiKey}`;
        return snekfetch.get(url).then(result => {
            let data = result.body;
            if (data.result.isError == 0) {
            //OK
                return Promise.resolve(data.result)
            } else {
                return Promise.reject(data.result.errDescription)
            }
        });
    }
};
