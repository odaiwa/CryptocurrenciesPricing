async function showCurrencies() {
    try {
        $(".main-loader").show();

        const Currencies = await getJSON("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
        displayCurrencies(Currencies);
    }
    catch (err) {
        console.log("Error retrieving Currencies.");
    }
}



async function MoreInfo(currency) {
    try {
        const response = await getJSON(`https://api.coingecko.com/api/v3/coins/${currency}`);
        return response;
    }
    catch (err) {
        console.log(`Error retrieving info for ${currency}.`);
    }
}

