const myKey = "380d4cdd56fdc23a8e5b27377509f220";
const searchForm = document.querySelector("#searchForm");
const prevSearchCont = document.querySelector("#prevSearchCont");
const city = document.querySelector(".cityName");
const condition = document.querySelector(".conditionIcon");
const currDate = document.querySelector(".currDate");
const temp = document.querySelector(".currTemp");
const humid = document.querySelector(".currHumid");
const wind = document.querySelector(".currWind");
const uvi = document.querySelector(".currUvi");
const fiveDay = document.querySelector(".fiveDayContainer");
let currCity = "";
let coords = [];
let response;

/* RUNS ON PAGE LOAD */
renderPrevSearch();

function search(event) {
    event.preventDefault();
    // console.log(event);
    // console.log(event.target.elements[0].value);
    let city = event.target.elements[0].value;
    latLongFetch(city);
    // console.log(coords);
    // saveSearch();
}

function choosePrevSearch(e) {
    // fiveDayData
    prevSch = e.target.textContent;
    // console.log(prevSch);
    latLongFetch(prevSch);

    // let city = event.target.elements[0].value;
    // latLongFetch(city);
}

function latLongFetch(city) {
    let cityReqURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
    console.log(city);
    fetch(cityReqURL)
        .then(function (response) {
            //console.log(response);
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            currCity = data.name;
            coords = [];
            coords.push(data.coord.lat);
            coords.push(data.coord.lon);
            saveSearch(currCity);
            renderWeather(coords);
        });
}

function saveSearch(currCity) {
    savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    if (!savedSearches) {
        savedSearches = [];
    }
    // let location = document.querySelector("#location").value;
    let location = currCity;
    for (i = 0; i < savedSearches.length; i++) {
        if (location === savedSearches[i]) {
            return;
        } else if (location === "") {
            return;
        }
    }
    // console.log(location);
    let newLocation = location;
    if (savedSearches.length === 8) savedSearches.shift();

    savedSearches.push(newLocation);
    savedSearches = JSON.stringify(savedSearches);
    localStorage.setItem("savedSearches", savedSearches);
    document
        .querySelectorAll(".prevSearchBtn")
        .forEach((e) => e.parentNode.removeChild(e));
    renderPrevSearch(savedSearches);
}

/* RENDERS LOCALSTORAGE SEARCHES TO THE PAGE */
function renderPrevSearch() {
    /*  querySelectioAll prevSearchBtn and delete them all before render*/

    let savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    if (!savedSearches) {
        console.log("no results");
        return;
    }
    for (let i = 0; i < savedSearches.length; i++) {
        // CREATE PREVIOUS SEARCH BUTTON
        const prevSchBtn = document.createElement("button");
        prevSchBtn.classList.add("prevSearchBtn");
        prevSchBtn.textContent = savedSearches[i];
        // APPEND TILE TO % DAY FORECAST CONTAINER
        prevSearchCont.appendChild(prevSchBtn);
    }
}

function renderWeather(coords) {
    let lat = coords[0];
    let lon = coords[1];
    // console.log(coords);
    // console.log(coords[1]);
    let weatherReqURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${myKey}`;
    fetch(weatherReqURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // CITY NAME RENDER
            city.innerText = currCity;
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
            // 5 DAY FORECAST DELETE EXISTING BEFORE RE-RENDER
            document
                .querySelectorAll(".fiveDayInd")
                .forEach((e) => e.parentNode.removeChild(e));
            // 5 DAY FORECAST RENDER
            let fiveDayData = data.daily;
            for (i = 1; i < 6; i++) {
                buildForecastTile(fiveDayData[i], 1);
            }
        });
}

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

    response = {};
}

searchForm.addEventListener("submit", search);
prevSearchCont.addEventListener("click", choosePrevSearch);
