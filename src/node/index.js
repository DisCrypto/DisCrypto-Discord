const RaiBlocks = require('node-raiblocks-rpc');
const raiblocks = new RaiBlocks(`localhost:7076`);

raiblocks.ledger('xrb_1111111111111111111111111111111111111111111111111111hifc8npp', 1).then(console.log).catch(console.log);

module.exports = raiblocks;
