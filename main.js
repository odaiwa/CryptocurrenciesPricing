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
    // event.preventDefault();
    /*
    document.getElementById(event.target.id + event.target.id).innerHTML = `<div class="loading-price">
    <div class="spinner-border" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  `*/
  console.log(`https://api.coingecko.com/api/v3/coins/${event}`)
//   console.log(event.id)
    try {
        const response = await getJSON(`https://api.coingecko.com/api/v3/coins/${event}`);
        document.getElementById(`more-info-about-currency-${event}`).innerHTML = 
            `${response.market_data.current_price.usd} $ <br>
            ${response.market_data.current_price.eur} € <br>
            ${response.market_data.current_price.ils} ₪`
    }
    catch (err) {
        alert(err.status);
    }
}

showCurrencies();
