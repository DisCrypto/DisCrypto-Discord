const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const getCurrencyInfo = function(name, callback) {
    let data = {};
    request(`https://coinmarketcap.com/currencies/${name}`, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            $('ul.list-unstyled a').each(function(){
                let fieldName = $(this).text();
                let url = $(this).attr("href");
                data[fieldName] = url
            });
            
            callback(data)
        } else {
            console.log("invalid currency name: " + name);
            callback({})
        }
    });
}

const performCoinScrape = function(callback) {
    let results = {}

    let tickers = JSON.parse(fs.readFileSync("./data/tickers.json"))
    let remaining = Object.keys(tickers).length

    for (let tickerSymbol in tickers) {
        let tickerName = tickers[tickerSymbol]

        getCurrencyInfo(tickerName, function(data) {
            console.log("processed: " + tickerSymbol + " : " + tickerName);

            results[tickerSymbol] = {
                name: tickerName,
                data: data
            }

            remaining--;

            if (remaining === 0) {
                callback(results)
            }
        });
    }

}

performCoinScrape(function(data){
    fs.writeFileSync("data/coininfo.json",JSON.stringify(data, null, 4))
});