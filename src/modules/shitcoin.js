const data = require('../data/shitcoins.json');
const Discord = require('discord.js');

module.exports = {
    name: 'shitcoin',
    type: 'core',
    usage: 'shitcoin',
    example: 'shitcoin',
    permission: 1,
    help: 'Generate your very own shitcoin and make MILLIONS!',
    main: function (client, message) {
        //generate your own shitcoin lmao

        const name1 = data.name1[Math.floor(Math.random() * data.name1.length)];
        const name2 = data.name2[Math.floor(Math.random() * data.name2.length)];
        let pBuzz = shuffleArray(data.buzzwords);
        let pAdj = shuffleArray(data.adjectives);
        let buzzwords = [];
        buzzwords[0] = pBuzz[0];
        buzzwords[1] = pBuzz[1];
        buzzwords[2] = pBuzz[2];
        let adjectives = [];
        adjectives[0] = pAdj[0];
        adjectives[1] = pAdj[1];
        adjectives[2] = pAdj[2];


        const industry = addCommas(Math.floor(Math.random() * 10000000));
        const industrySuffix = (Math.random() > 0.5) ? " Trillion" : " Billion";
        const icoMoney = addCommas(Math.floor(Math.random() * 1000000));
        const icoSuffix = (Math.random() > 0.5) ? " Billion" : " Million";

        const icoTime = msToTime(Math.random() * 100000000);



        const desc = `\n\nIntroducing **${name1}${name2}**, the next MOON COIN!\n\nThis coin revolutionizes **${buzzwords[0]}**, along with **${buzzwords[1]}**.`
        + `\n\nThe real kicker of this coin, however, is it's groundbreaking tech in **${buzzwords[2]}**. It's going to disrupt a **$${industry}${industrySuffix}** industry.`
        + `\n\nEven better, the team is **${adjectives[0]}**, the whitepaper is **${adjectives[1]}**, and the community is just **${adjectives[2]}**!`
        + `\n\nTheir ICO is ongoing, it's raised **$${icoMoney}${icoSuffix}** so far! \n\nThere's only **${icoTime}** left!\n\nBuy for **10,000%** gainz!`;

        let emb = new Discord.RichEmbed()
            .setTitle(`New Shitcoin`)
            .setColor([139,69,19])
            .setTimestamp()
            .setDescription(desc);
        message.channel.send(emb);
    },
};


function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + "hrs, " + minutes + "min, " + seconds + "sec, and " + milliseconds + "ms";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addCommas(x) {
    if (!x) {
        return "N/A";
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
