/// <reference path="jquery-3.6.0.js" />
"use strict";


async function showCurrencies() {
    try {
        const Currencies = await getJSON("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
        displayCurrencies(Currencies);
    }
    catch (err) {
        console.log("Error")
        alert(err.status);
    }
}

function displayCurrencies(Currencies) {
    $("#currencies").empty();
    for (const Currency of Currencies) {
        const tr =
            `<div class="currency-card">
                <div class="card-body">
                    <div id="currency-header">
                        <img src="${Currency.image}" />
                        <h5 class="card-title">${Currency.symbol}</h5>
                        <p class="card-text">${Currency.name}</p>
                    </div> 
                
                <button class="btn btn-info" onclick="MoreInfoForCurrency('${Currency.id}')">More info</button>
                <p id="more-info-about-currency-${Currency.id}"></p>
                </div>
            </div>`;
        $("#currencies").append(tr);
    }
}


async function MoreInfoForCurrency(event) {


    //    console.log(`#more-info-about-currency-${event}`)
    //    console.log(event);

    const currencyMoreInfo = `more-info-about-currency-${event}`;
    const moreInfoAboutCurrency = document.getElementById(currencyMoreInfo);
    if (!moreInfoAboutCurrency.innerHTML.length === 0) {
        console.log(moreInfoAboutCurrency);
        $(currencyMoreInfo).empty();
    }
    else {
        console.log("there's no more info about currency")
        try {
            const response = await getJSON(`https://api.coingecko.com/api/v3/coins/${event}`);
            $(currencyMoreInfo).empty();
            // console.log(response.market_data.current_price.usd)
            const p = `
            <div>
                <p id="more-info-${event}-dollar">${response.market_data.current_price.usd} $</p>
            </div>
            `;
             console.log("Pre-MoreInfo about "+event+ " "+p);
             $(currencyMoreInfo).append(p);
             moreInfoAboutCurrency.innerHTML = p;
             console.log("Post-MoreInfo about "+event);
            // console.log(response.market_data.current_price.usd+"asdasd")
            /*  document.getElementById(`more-info-about-currency-${event}`).innerHTML = 
            `${response.market_data.current_price.usd} $<br>
            ${response.market_data.current_price.eur} € <br>
            ${response.market_data.current_price.ils} ₪`*/
        }
        catch (err) {
            alert(err.status);
        }
    }
}

showCurrencies();
