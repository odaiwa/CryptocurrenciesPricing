/// <reference path="js/jquery-3.6.0.js" />
"use strict";


function displayCurrencies(Currencies) {
    $("#currencies").empty();
    for (const Currency of Currencies) {
        console.log(Currency.id)
        const tr =
            `<div class="currency-card">
                <div class="card-body">
                    <div id="currency-header">
                    <h5 class="card-title">${Currency.symbol}</h5>
                    <p class="card-text">${Currency.name}</p>
                    </div>
                    <button class="btn btn-info" onclick="MoreInfoForCurrency('${Currency.id}')">More info</button>
                    <div class="loader hide-loader" id="${Currency.id}-loader" style="display:none"></div> 
                
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
    $("#footer-p").html(footerinfo);
}


async function MoreInfoForCurrency(id) {
    console.log(id)
    const moreInfoAboutCurrency = $(`#more-info-about-currency-${id}`);
    if (moreInfoAboutCurrency.text().length > 0) {
        console.log(moreInfoAboutCurrency.text())
        moreInfoAboutCurrency.empty();
    }
    else {

        let prices = []
        let jsonArray = localStorage.getItem(id);
        if (jsonArray) {
            prices = JSON.parse(jsonArray);
            if (Date(jsonArray.addedTime)) {
                showMoreInfo(prices)
            }
            else {
                localStorage.removeItem(id);
            }
        }
        else {

            const moreInfo = await MoreInfo(id);
            console.log(moreInfo);
            saveToLocalStorage(moreInfo);
            jsonArray = localStorage.getItem(id);
            prices = JSON.parse(jsonArray);
            showMoreInfo(prices)
        }
    }
}


function showMoreInfo(info) {
    const moreInfoAboutCurrency = $(`#more-info-about-currency-${info.id}`);

    const p = `
            <div class="currency-prices">
                <img src="${info.img}" />
                <p id="more-info-price">${info.nis} ₪</p>
                <p id="more-info-price">${info.usd} $</p>
                <p id="more-info-price">${info.euro} €</p>
            </div>
            `;

    moreInfoAboutCurrency.append(p);
    console.log("after append")
}


function saveToLocalStorage(data) {
    console.log(data);
    const timer = new Date().getTime();
    const currencyInfo = {
        id: data.id,
        nis: data.market_data.current_price.ils,
        usd: data.market_data.current_price.usd,
        euro: data.market_data.current_price.eur,
        img: data.image.thumb,
        addedTime: timer
    }
    localStorage.setItem(data.id, JSON.stringify(currencyInfo));
}


$(window).on('scroll', () => {
    if ($(this).scrollTop()) {
        $('#backToTopBtn').fadeIn();
    } else {
        $('#backToTopBtn').fadeOut();
    }
});

$("#backToTopBtn").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});


footerData();
showCurrencies();