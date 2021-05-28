/// <reference path="jquery-3.6.0.js" />
"use strict";


async function showUsers() {
    try {
        const users = await getJSON("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
        displayUsers(users);
    }
    catch (err) {
        alert(err.status);
    }
}

function displayUsers(users) {
    $("#child").empty();
    for (const user of users) {
        const tr =
            `<div class="currency-card" style="width: 18rem;">
                <div class="card-body">
                <div class="custom-control custom-switch">
                <h5 class="card-title"> <img src="${user.image}}" />${user.symbol}</h5>
                <input type="checkbox" value="${user.symbol}" class="custom-control-input ${user.symbol}" id="${user.id}"> 
                <label class="custom-control-label" for="${user.id}"></label>
            </div>
          <p class="card-text">${user.name}</p>
            <button id="${user.id}" class="btn btn-info"> More info</button>
            <p class="collapse .loading-price text-danger" id="${user.id + user.id}">
            </p>
        </div>
      </div>`;
    $("#child").append(tr);
    }  דאק
}

showUsers();
