const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const getCurrencyList = function(callback) {
    let results = []
    request(`https://coinmarketcap.com/coins/views/all/`, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            $('#currencies-all tr').each(function() {
                let isHeader = $(this).find("th").length > 0;
                if (!isHeader) {
                    let currencyName = $(this).find(".currency-name-container").attr("href").match(/currencies\/(.*)\//)[1]
                    let currencySymbol = $(this).find(".col-symbol").text().toLowerCase()

                    results.push({
                        name: currencyName,
                        symbol: currencySymbol
                    })
                }
            });

            callback(results);
        } else {
            console.log("failed to request list of currencies..");
            callback([]);
        }
    });
}

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

    getCurrencyList(function(list) {
        console.log("total currencies: " + list.length)

        let remaining = list.length

        list.forEach(function(currency) {
            getCurrencyInfo(currency.name, function(data) {
                console.log("processed: " + currency.name);

                results[currency.symbol] = {
                    name: currency.name,
                    data: data
                }

                remaining--;

                if (remaining === 0) {
                    callback(results)
                }
            });
        })
    })
}

performCoinScrape(function(data){
    fs.writeFileSync("data/coininfo.json",JSON.stringify(data, null, 4))
});