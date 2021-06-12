/** TODO
 * color code UV
 * get dynamic date
 *
 *
 * get 5 day forecast, loop and create tiles, needs ...
 * date
 * condition icon
 * temp
 * wind
 * humid
 *
 *
 * enable search
 * save search into localstorage, limit to 8
 *
 *
 *
 */

// const location = 63139;
const myKey = "4627a364c0e13e7b1cf41e43f2e731d4";
const condition = document.querySelector(".conditionIcon");
const temp = document.querySelector(".currTemp");
const humid = document.querySelector(".currHumid");
const wind = document.querySelector(".currWind");
const uvi = document.querySelector(".currUvi");

let currWeatherReqURL = `https://api.openweathermap.org/data/2.5/onecall?lat=38.6247&lon=-90.1848&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${myKey}`;

fetch(currWeatherReqURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var iconSrc = data.current.weather[0].icon;
        var iconAlt = data.current.weather[0].description;
        // console.log(icon);
        condition.src = `http://openweathermap.org/img/wn/${iconSrc}.png`;
        condition.alt = iconAlt;
        temp.innerText = `Temp: ${data.current.temp}`;
        humid.innerText = `Humidity: ${data.current.humidity}%`;
        wind.innerText = `Wind speed: ${data.current.wind_speed} MPH`;
        uvi.innerText = `UV Index: ${data.current.uvi}`;
    });
