var apiKey = "bd55593ecb666c01d38f4ec9276324e8";

var city = "";
var searchCity = $("#city-input");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWind = $("#wind-speed");
var sCity = [];

function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// Current forecast
function currentWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
  
    fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function(response) {
        console.log(response);
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        $(currentCity).html(response.name + " " + "(" + date + ")" + "<img src=" + iconurl + ">");
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
  
        $(currentTemperature).html(" " + (tempF).toFixed(2) +" " +  "&#8457");
        $(currentHumidity).html(" " + response.main.humidity +" " +  "%");
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWind).html(" " + windsmph +" " +  "MPH");
  
        forecast(response.id);
        if (response.cod == 200) {
          sCity = JSON.parse(localStorage.getItem("cityname"));
          console.log(sCity);
          if (sCity == null) {
            sCity = [];
            sCity.push(city.toUpperCase());
            localStorage.setItem("cityname", JSON.stringify(sCity));
            addToList(city);
          }
          else {
            if (find(city) > 0) {
              sCity.push(city.toUpperCase());
              localStorage.setItem("cityname", JSON.stringify(sCity));
              addToList(city);
            }
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  

// Five Day forecast
function forecast(cityid) {
    var fiveUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + apiKey;
    
    fetch(fiveUrl)
        .then(response => response.json())
        .then(response => {
            for (i = 0; i < 5; i++) {
                var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
                var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
                var tempK = response.list[((i + 1) * 8) - 1].main.temp;
                var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
                var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

                $("#Date" + i).html(date);
                $("#Img" + i).html("<img src=" + iconurl + ">");
                $("#Temp" + i).html(" " + tempF + " &#8457");
                $("#Humidity" + i).html(" " + humidity + " %");
            }
        })
        .catch(error => console.log(error));
}

function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }
}

function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }
}


// Event listener for location search form submit
document.getElementById('search-button').addEventListener('submit', (event) => {
    event.preventDefault();
    currentWeather();
  });

$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);

var isFahrenheit = true;
function toggleUnits() {
    var temperature = parseFloat(currentTemperature.html());
    if (isFahrenheit) {
      temperature = (temperature - 32) * (5/9);
      currentTemperature.html(temperature.toFixed(2) + " &#8451");
    } else {
      temperature = (temperature * (9/5)) + 32;
      currentTemperature.html(temperature.toFixed(2) + " &#8457");
    }
    isFahrenheit = !isFahrenheit;
  }
  $("#toggle-units").on("click", toggleUnits);
