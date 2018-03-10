const Scanners = require("./../scanners/index");

let helper = {};
require('./../funcs')(helper);



module.exports = {
    name: 'scan',
    type: 'all',
    usage: 'scan [address|txid] [coin]',
    example: 'scan 0x141766882733cafa9033e8707548fdcac908db22',
    permission: 1,
    help: 'Scan a address or txid',
    main: async function(bot, msg) {
        if (msg.args.length < 1) {
            return helper.showUsage(this, msg);
        }

        let address = msg.args[0];

        let coinSymbol = determineCurrency(address);
        if (!coinSymbol && !msg.args[1]) return msg.channel.send(`Unable to detect currency based on address, if it is a txid please put the coin (ETH OR BTC) after it. Ex: \`scan (txid) btc\``);
        if (msg.args[1]) coinSymbol = msg.args[1];
        let scanner = Scanners[coinSymbol];
        if (!scanner) return msg.channel.send(`${coinSymbol} is not supported for scan operations yet`);

        scanner.scanAndRender(address, msg).catch((err) => {
            if (err.message) {
                return msg.channel.send(err.message);
            } else {
                console.log(err);
            }
        });
    }
};

const determineCurrency = function(addressOrTransactionHash) {
    let prefix = addressOrTransactionHash.split("_")[0];

    let isBitcoinPrefix = prefix.startsWith(`1`) || prefix.startsWith(`3`);
    let isEthereumPrefix = prefix.startsWith(`0x`);

    if (isBitcoinPrefix) return "btc";
    if (isEthereumPrefix) return "eth";

    return null;
};
