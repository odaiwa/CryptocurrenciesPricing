/// <reference path="js/jquery-3.6.0.js" />
"use strict";


function displayCurrencies(Currencies) {
    $("#currencies").empty();
    for (const Currency of Currencies) {
        // console.log(Currency.id)
        const card = `    
        <div class="card">
            <div class="card__content">
            <div class="check-box-for-crypto">
                <input type="checkbox" id="customSwitch1">
            </div>
            <h4 class="card__header">${Currency.symbol}</h4>
            <p class="card__info">${Currency.name}</p>
            <div id="more-info-about-currency-${Currency.id}"></div>
            <button class="card__button" onclick="MoreInfoForCurrency('${Currency.id}')">More Info</button>
            <div class="loader hide-loader" id="${Currency.id}-loader" style="display:none"></div> 
            <div class="custom-control custom-switch custom-switch-sm">
            </div>
            </div>
        </div>`;
        
        $("#currencies").append(card);
    }
}

function footerData() {
    const d = new Date();
    const n = d.getFullYear();
    const footerInfo = `Copyright © ${n} Odai Wattad`
    $("#footer-p").html(footerInfo);
}


function MoreInfoForCurrency(id) {
    // console.log(id)
    const moreInfoAboutCurrency = $(`#more-info-about-currency-${id}`);
    if (moreInfoAboutCurrency.text().length > 0) {
        // console.log(moreInfoAboutCurrency.text())
        moreInfoAboutCurrency.empty();
    }
    else {
        let prices = []
        let jsonArray = localStorage.getItem(id);
        if (jsonArray) {
            prices = JSON.parse(jsonArray);
            if (!checkTimeStamps(prices.addedTime)) {
                showMoreInfo(prices);
            }
            else {
                localStorage.removeItem(id);
                showData(id);
            }
        }
        else {
            showData(id);
        }
    }
}

async function showData(id) {

    $(`#${id}-loader`).show();
    const moreInfo = await MoreInfo(id);
    saveToLocalStorage(moreInfo);
    let prices = [];
    const jsonArray = localStorage.getItem(id);
    prices = JSON.parse(jsonArray);
    showMoreInfo(prices);

}

function showMoreInfo(info) {

    $(`#${info.id}-loader`).show();
    const moreInfoAboutCurrency = $(`#more-info-about-currency-${info.id}`);
    moreInfoAboutCurrency.empty();
    const p = `
            <div class="currency-prices">
                <img src="${info.img}" />
                <p id="more-info-price">${info.nis} ₪</p>
                <p id="more-info-price">${info.usd} $</p>
                <p id="more-info-price">${info.euro} €</p>
            </div>
            `;
    $(`#${info.id}-loader`).hide();
    moreInfoAboutCurrency.append(p);

}


function saveToLocalStorage(data) {
    // console.log(data);
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

function checkTimeStamps(id) {
    const timeNow = new Date().getTime();
    const timeRemainder = timeNow - id;
    console.log(timeRemainder, "<-new , old -> ", id)
    if (timeRemainder > 0) {
        return timeRemainder >= 1000 * 60 * 2;
    }
    return false;
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

function showSpecificCountry() {
    let input = $("#specific-country").val();
    if (input.length == 0) {
        Swal.fire(
            'you cannot leave input empty...',
            'you must support currency name',
            'error'
        )
        showCurrencies();
    }

    let filter, cards, cardContent, title, i;
    // input = document.getElementById("myFilter");
    // filter = input.toLowerCase();
    const tobeSelected = "#currencies .card .card__content ";
    // cardContainer = $("#currencies");
    // console.log(cardContainer)
    cards = $("#currencies .card");
    cardContent = $(`${tobeSelected} .card__header`);
    console.log(cardContent[0].firstChild.nodeValue.toLowerCase());
    for (i = 0; i < cards.length; i++) {
        title = (cardContent[i].firstChild.nodeValue.toLowerCase());
        if (title === input.toLowerCase()) {
            $(cards[i]).show();
        } else {
            $(cards[i]).hide();
        }
    }
    let numberofC=0;
    for(let i=0;i<cards.length;i++){
        if( $(cards[i]).is(':hidden')){
            numberofC++;
        }
    }
    numberofC === cards.length ? errorMsgForCurrenct(input) : Swal.fire('','','success');


}

function errorMsgForCurrenct(input){
    Swal.fire(`there is no currency in name ${input.toLowerCase()}`,'','error');
    showCurrencies();
}

footerData();
showCurrencies();