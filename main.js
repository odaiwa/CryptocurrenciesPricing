/// <reference path="jquery-3.6.0.js" />
"use strict";


async function showCurrencies() {
    try {
        //
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

function footerData() {
    const d = new Date();
    const n = d.getFullYear();
    const footerinfo = `Copyright © ${n} Odai Wattad`
    document.getElementById("footer-p").innerHTML = footerinfo;
}

async function MoreInfoForCurrency(event) {

    const currencyMoreInfo = `more-info-about-currency-${event}`;
    const moreInfoAboutCurrency = document.getElementById(currencyMoreInfo);
    console.log(moreInfoAboutCurrency.innerText)

    let currentCurrency = [];
    const jsonArray = localStorage.getItem(event);
    if (jsonArray) {
        currentCurrency = JSON.parse(jsonArray);
        if (moreInfoAboutCurrency.innerText.length !== 0) {
            $("#" + currencyMoreInfo).empty();
        }
        else{
            console.log("toke from localStorage");
            const p = `
            <div class="currency-prices">
            <p id="more-info-price">${currentCurrency.nis} ₪</p>
            <p id="more-info-price">${currentCurrency.usd} $</p>
            <p id="more-info-price">${currentCurrency.euro} €</p>
            </div>
            `;
            
            $("#" + currencyMoreInfo).append(p);
        }

    }
    else {

        if (moreInfoAboutCurrency.innerText.length !== 0) {
            $("#" + currencyMoreInfo).empty();
        }
        else {
            console.log("from ajax")
            // console.log("there's no more info about currency")
            try {
                const response = await getJSON(`https://api.coingecko.com/api/v3/coins/${event}`);
                $(currencyMoreInfo).empty();

                const currencyPrice = {
                    id: event,
                    nis: response.market_data.current_price.ils,
                    usd: response.market_data.current_price.usd,
                    euro: response.market_data.current_price.eur
                }

                console.log(currencyPrice)
                const p = `
                <div class="currency-prices">
                <p id="more-info-price">${currencyPrice.nis} ₪</p>
                <p id="more-info-price">${currencyPrice.usd} $</p>
                <p id="more-info-price">${currencyPrice.euro} €</p>
                </div>
                `;
                $("#" + currencyMoreInfo).append(p);

                saveToLocalStorage(currencyPrice);
            }
            catch (err) {
                alert(err.status);
                console.log("Error Occured")
            }
        }
    }
}


function saveToLocalStorage(data) {

    const timer = new Date().getTime();
    const currencyInfo = {
        id: data.id,
        nis: data.nis,
        usd: data.usd,
        euro: data.euro,
        addedTime: timer
    }
    localStorage.setItem(data.id, JSON.stringify(currencyInfo));
}

const mybutton = document.getElementById("myBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


footerData();
showCurrencies();
