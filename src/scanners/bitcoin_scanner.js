const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const web3 = require('web3');
const Web3util = new web3();

function fromSat (val) {
    return val / 100000000;
}

module.exports = {
    scanAndRender: async function(address, msg) {
        let addressType = this.determineAddressType(address);
        if (!addressType) return Promise.reject({ message: `Invalid address ${address}` });

        let data = await this.scan(address, addressType).catch(() => {
            return Promise.reject({ message: `Invalid address ${address}` });
        });

        data["address"] = address;
        data["addressType"] = addressType;

        this.render(msg, data);
    },

    scan: function(address, addressType) {
        if (addressType === "account") {
            return this.getBalanceFromBitcoinAddress(address).then(function(balance) {
                console.log(balance);
                return Promise.resolve({ result: fromSat(balance) });
            }).catch(function(err) {
                return Promise.resolve({ error: err });
            });
        } else if (addressType === "transaction") {
            return this.getTransactionHashData(address).then(function(result) {
                return Promise.resolve({ result: result });
            }).catch(function(err) {
                return Promise.resolve({ error: err });
            });
        }

    },


    determineAddressType: function(address) {
        if (address.length === 34) return "account";
        if (address.length === 64) return "transaction";

        return null;
    },

    /*
        data = {
            address: "",
            addressType: "account",
            result: ""
        }
    */
    render: function(msg, data) {
        let emb = new Discord.RichEmbed();

        switch(data.addressType) {
        case "account":
            // address given
            emb.setTitle(`Bitcoin Address`)
                .setDescription(`Data for address ${data.address}:`)
                .addField(`Balance:`, data.result.toFixed(11) + " BTC");
            break;
        case "transaction":
            // transaction given
            let total = 0;
            let desc = `\n**Inputs**:\n`;
            console.log(data);
            for (let val of data.result.inputs) {
                total += val.prev_out.value;
                desc += `\n${val.prev_out.addr} - **${fromSat(val.prev_out.value)} BTC**`;
            }
            desc += `\n\n**Outputs**:\n`;
            for (let val of data.result.out) {
                desc += `\n${val.addr} - **${fromSat(val.value)} BTC**`;
            }
            desc += `\n\n\n**Total BTC Sent: ${fromSat(total)} BTC**`;
            emb.setTitle(`Bitcoin Transaction`)
                .setDescription(desc);

            break;
        default:
        }

        emb.attachFile(`./data/icons/btc.png`)
            .setThumbnail(`attachment://btc.png`)
            .setColor(`GOLD`);

        msg.channel.send(emb);
    },

    getBalanceFromBitcoinAddress: function(address) {
        let url = `https://blockchain.info/q/addressbalance/${address}`;
        return snekfetch.get(url).then(result => {
            let data = result.body;
            let balance = parseInt(data);
            if (isNaN(balance)) {return Promise.reject({});}
            return Promise.resolve(balance);
        }).catch(()=>{return Promise.reject({});});
    },

    getTransactionHashData: function(transactionHash) {
        let url = `https://blockchain.info/rawtx/${transactionHash}`;
        return snekfetch.get(url).then(result => {
            let data = result.body;
            //OK
            return Promise.resolve(data);
        }).catch(()=>{return Promise.reject({});});
    }
};
