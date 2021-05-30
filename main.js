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
                <div id="more-info-about-currency-${Currency.id}"></div>
                </div>
            </div>`;
        $("#currencies").append(tr);
    }
}

function footerData(){
    const d = new Date();
    const n = d.getFullYear();
    const footerinfo=`Copyright © ${n} Odai Wattad`
    document.getElementById("footer-p").innerHTML = footerinfo;
}

async function MoreInfoForCurrency(event) {


    const currencyMoreInfo = `more-info-about-currency-${event}`;
    const moreInfoAboutCurrency = document.getElementById(currencyMoreInfo);
    console.log(moreInfoAboutCurrency.innerText)
    if (moreInfoAboutCurrency.innerText.length !== 0) {
        $("#"+currencyMoreInfo).empty();
    }
    else {
        console.log("there's no more info about currency")
        try {
            const response = await getJSON(`https://api.coingecko.com/api/v3/coins/${event}`);
            $(currencyMoreInfo).empty();
            const p = `
            <div class="currency-prices">
                <p id="more-info-price">${response.market_data.current_price.ils} ₪</p>
                <p id="more-info-price">${response.market_data.current_price.usd} $</p>
                <p id="more-info-price">${response.market_data.current_price.eur} €</p>
            </div>
            `;
            $("#"+currencyMoreInfo).append(p);

        }
        catch (err) {
            alert(err.status);
        }
    }
}
footerData();
showCurrencies();
