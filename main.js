/// <reference path="js/jquery-3.6.0.js" />
"use strict";

/**
 * in this function we create the card of each currency
 * and adds them to currencies div.
 * @param {*} Currencies 
 */
function displayCurrencies(Currencies) {
    $("#currencies").empty();
    for (const Currency of Currencies) {
        const card = `    
        <div class="card" id=${Currency.symbol}>
            <div class="card__content">
            <label class="switch">
                <input id="${Currency.symbol}Checkbox" type="checkbox" onclick="selectCoin('${Currency.symbol}',${event})">
                <span  class="slider round"></span>
            </label>
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

$(".switch").on("click",function(event){
    console.log();
});

/**
 * Footer Data.
 */
function footerData() {
    const d = new Date();
    const n = d.getFullYear();
    const footerInfo = `Copyright © ${n} Odai Wattad`;
    console.log(footerInfo)
    $("#footer-p").html(footerInfo);
}

/**
 * This Function will display the more info about selected currency
 * if the data in the LocalStorage is invalid (passed more than two mins) 
 * it will make an API request for the specific currency and get the data about it.
 * @param {*} id 
 */
function MoreInfoForCurrency(id) {
    const moreInfoAboutCurrency = $(`#more-info-about-currency-${id}`);
    if (moreInfoAboutCurrency.text().length > 0) {
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


/**
 * this function will get the data from LocalStorage and send it to @function showMoreInfo()
 * @param {*} id 
 */
async function showData(id) {
    $(`#${id}-loader`).show();
    const moreInfo = await MoreInfo(id);
    saveToLocalStorage(moreInfo);
    let prices = [];
    const jsonArray = localStorage.getItem(id);
    prices = JSON.parse(jsonArray);
    showMoreInfo(prices);

}


/**
 * this function will dispaly the info the exact div for currency
 * @param {*} info 
 */
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

/**
 * this function will save the data to localStorage
 * it will create currencyInfo Object and save it to localStorage
 * @param {*} data 
 */
function saveToLocalStorage(data) {
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

/**
 * this function will check if the two mins has passed or not
 * @param {*} id 
 * @returns false-true
 */

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

function searchForCurrency() {
    let input = $("#specific-currency").val();
    if (input.length == 0) {
        Swal.fire(
            'you cannot leave input empty...',
            'you must support currency name',
            'error'
        )
        showCurrencies();
    }
    let cards, cardContent, title, i;
    const tobeSelected = "#currencies .card .card__content ";
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
    let numberofC = 0;
    for (let i = 0; i < cards.length; i++) {
        if ($(cards[i]).is(':hidden')) {
            numberofC++;
        }
    }
    //
    numberofC === cards.length ? errorMsgForCurrenct(input) : console.log(input);

}

function searchCoinByID() {
    let coinID = $("#specific-currency").val().toLowerCase();
    if (coinID) {
        let cards = $("#currencies .card");

        for (let card of cards) {
            if (card.innerText.toLowerCase().includes(coinID)) {
                $(card).show();
            }
            else {
                $(card).hide();
            }
        }
    }
    else {
        Swal.fire(
            'you cannot leave input empty...',
            'you must support currency name',
            'error'
        )
        showCurrencies();
    }
    let cards = $("#currencies .card");

    let numberofC = 0;
    for (let i = 0; i < cards.length; i++) {
        if ($(cards[i]).is(':hidden')) {
            numberofC++;
        }
    }
    //
    numberofC === cards.length ? errorMsgForCurrenct(coinID) : console.log(coinID);

}

/**
 * this function will show a better shaped alert if the name that has
 * been supported is not a real name.
 * @param {string} input 
 */
function errorMsgForCurrenct(input) {
    Swal.fire(`there is no currency in name ${input.toLowerCase()}`, '', 'error');
    $("#specific-currency").val("");
    showCurrencies();
}

function selectCoin(symbol){
    if($(`#${symbol}Checkbox`).prop('checked') == true){
        sessionStorage.setItem(symbol,symbol);
        console.log(`${symbol} has been selected`);
    }else{
        sessionStorage.removeItem(symbol);
        console.log(`${symbol} has been removed`);

    }
}

function deleteLocalStorageCounter() {

    let jsonArray = localStorage.getItem("counter");
    if (jsonArray) {
        localStorage.removeItem("counter");
    }
}

function about() {
    const aboutMe =
        `<div id="aboutComponent">
    <div class="profile-img">
        <img src="assets/images/IMG-0383.jpg">
    </div>
    <div class="about-card">
        <div class="about-me">
            <h2>
                About me :
            </h2>
            <p>
                <h4>Odai Wattad</h4>a 22 years old software Engineer from Jatt, 
                about to finish my B.Sc. in SCE.<br>
                Currently learning full-stack development in John Bryce
            </p>
            <p>
                <h2>Hobbies:</h2>
                <ul>
                    <li>Photographing </li>
                    <li>Football </li>
                    <li>Writing code</li>
                    <li>Sleeping</li> 
                </ul>
            </p>

        </div>
        <div class="about-the-project">
            <h2>
                About the website:
            </h2>
            <p>
            The website shows the top 100 cryptocurrencies , price information about each currency.<br><br>
            ⁕ <b>First page</b> displays the top 100 cryptocurrencies sorted by market cap.<br><br>
            ⁕ <b>The second page</b> will display real time prices of the selected currencies.<br><br>
            ⁕ <b>The about page</b> that's what you're in right now.
            </p>
        </div>
    </div>
</div>
`;
    $('#currencies').html(aboutMe);

    const about2 = `<div class="about-me">
<h1>About Page</h1>
<hr>

<h2 >Student 4th year software engineering at SCE.</h2><br />
<p>The Cryptonite site displays virtual currencies and their cost in shekels, dollars and euros. Soon on the site you will be able to see coins and their status in the graph   </p>
</div>
`;
}

$(document).ready(function () {
    $('#home').click(showCurrencies);
});


sessionStorage.clear();
deleteLocalStorageCounter()
footerData();
