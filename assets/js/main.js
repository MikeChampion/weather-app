/** TODO
 * get dynamic city name data
 *
 *
 * enable search
 * save search into localstorage, limit to 8
 * loop over and create 'past search' buttons
 *
 */

// const location = 63139;
const myKey = "4627a364c0e13e7b1cf41e43f2e731d4";
const searchTerm = document.querySelector("#searchForm");
const condition = document.querySelector(".conditionIcon");
const currDate = document.querySelector(".currDate");
const temp = document.querySelector(".currTemp");
const humid = document.querySelector(".currHumid");
const wind = document.querySelector(".currWind");
const uvi = document.querySelector(".currUvi");
const fiveDay = document.querySelector(".fiveDayContainer");

let weatherReqURL = `https://api.openweathermap.org/data/2.5/onecall?lat=38.6247&lon=-90.1848&units=imperial&exclude=minutely,hourly,alerts&appid=${myKey}`;

fetch(weatherReqURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // CURRENT CONDITIONS RENDER
        var iconSrc = data.current.weather[0].icon;
        var iconAlt = data.current.weather[0].description;
        condition.src = `http://openweathermap.org/img/wn/${iconSrc}.png`;
        condition.alt = iconAlt;
        // CONVERT AND RENDER DATE
        var today = data.current.dt;
        var day = moment.unix(today).format("MMMM Do YYYY");
        currDate.innerText = day;
        temp.innerHTML = `Temp: ${data.current.temp}&deg; F`;
        humid.innerText = `Humidity: ${data.current.humidity}%`;
        wind.innerText = `Wind speed: ${data.current.wind_speed} MPH`;
        uvi.innerHTML = `UV Index: <span class="uvColor">${data.current.uvi}</span>`;
        const uvColor = document.querySelector(".uvColor");
        if (data.current.uvi < 3) {
            // for uvindex of 0-2
            uvColor.classList.add("uvLow");
        } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
            // for uvindex of 3-5
            uvColor.classList.add("uvModerate");
        } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
            // for uvindex of 6-7
            uvColor.classList.add("uvHigh");
        } else if (data.current.uvi >= 8 && data.current.uvi < 11) {
            // for uvindex of 8-10
            uvColor.classList.add("uvVeryHigh");
        } else {
            // for uvindex of 11+
            uvColor.classList.add("uvExtreme");
        }
        // 5 DAY FORECAST RENDER
        let fiveDayData = data.daily;
        for (i = 1; i < 6; i++) {
            buildForecastTile(fiveDayData[i], 1);
        }
    });

function buildForecastTile(data) {
    // CREATE INDIVIDUAL DAY CELL
    const weatherCell = document.createElement("div");
    weatherCell.classList.add("fiveDayInd");
    // APPEND DIV FOR DATE / ICON TO CELL
    const dateIcon = document.createElement("div");
    dateIcon.classList.add("date-icon");
    weatherCell.appendChild(dateIcon);
    // APPEND DATE TO DIV
    const date = document.createElement("p");
    var today = data.dt;
    var day = moment.unix(today).format("MMM Do");
    date.innerText = day;
    dateIcon.appendChild(date);
    // APPEND CONDITION ICON TO DIV
    let fIcon = document.createElement("img");
    var fIconSrc = data.weather[0].icon;
    var fIconAlt = data.weather[0].description;
    fIcon.src = `http://openweathermap.org/img/wn/${fIconSrc}.png`;
    fIcon.alt = fIconAlt;
    fIcon.class = "forecastIcon";
    dateIcon.appendChild(fIcon);
    // APPEND DIV2 FOR DATA TO CELL
    const dayDataCell = document.createElement("div");
    dayDataCell.classList.add("fiveDayData");
    weatherCell.appendChild(dayDataCell);
    // APPEND TEMP TO DIV2
    const fDayTemp = document.createElement("p");
    fDayTemp.innerHTML = `Temp: ${data.temp.day}&deg; F`;
    dayDataCell.appendChild(fDayTemp);
    // APPEND WIND TO DIV2
    const fDaywind = document.createElement("p");
    fDaywind.innerText = `Wind: ${data.wind_speed} MPH`;
    dayDataCell.appendChild(fDaywind);
    // APPEND HUMIDITY TO DIV2
    const fDayHumid = document.createElement("p");
    fDayHumid.innerText = `Humidity: ${data.humidity}%`;
    dayDataCell.appendChild(fDayHumid);
    // APPEND TILE TO % DAY FORECAST CONTAINER
    fiveDay.appendChild(weatherCell);
}

function search(event) {
    event.preventDefault();
    console.log(event.target.elements[0].value);
}

searchTerm.addEventListener("submit", search);
