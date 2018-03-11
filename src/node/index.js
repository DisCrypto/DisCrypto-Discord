const RaiBlocks = require('raiblocks');
const options = {
    host: "127.0.0.1",
    port: 7076
};

const raiblocks = new RaiBlocks(options);

module.exports = raiblocks;
