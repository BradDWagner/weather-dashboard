var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var APIkey = "172ecdfeb9ed3b4659678bbef29c9bdf";
var iconUrlStart = "http://openweathermap.org/img/wn/"
var iconUrlEnd = "@2x.png"

var citySearch = $("#city-search")
var searchButton = $("#search-button")

var searchHistoryArray = [];
var storedSearchHistory =[]

function init (){
    storedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    console.log(storedSearchHistory)
    if (storedSearchHistory !== null){
        searchHistoryArray = storedSearchHistory
        showHistory()
    }
}
init()

function showHistory (){
    $("#previous-search").empty();
    for (i=0; i<storedSearchHistory.length; i++) {
        var button = $("<button></button>").text(storedSearchHistory[i]).addClass("history-button btn btn-secondary");
        $("#previous-search").append(button);
    }
    var prevSearches = $(".history-button");
    prevSearches.on("click", function(event) {
        event.preventDefault;
        var prevCity = $(event.target).text();
        $("#hide-on-start").removeClass("d-none")
        todaysWeather(prevCity);
        fiveDayWeather(prevCity);
        
    })
}

searchButton.on("click", function(event) {
    event.preventDefault();
    var selectedCity = citySearch.val();
    searchHistoryArray.push(selectedCity);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistoryArray))
    $("#hide-on-start").removeClass("d-none")
    todaysWeather(selectedCity);
    fiveDayWeather(selectedCity);
    showHistory();
})


function todaysWeather (city){
    fetch(todayUrl + city + "&units=imperial&appid=" + APIkey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        $("#today-loc").text(data.name +" "+ moment(data.dt, "X").format("L"));
        $("#today-icon").attr("src", iconUrlStart + data.weather[0].icon + iconUrlEnd)
        $("#today-temp").text("Temp: " + data.main.temp + "F");
        $("#today-wind").text("Wind: " + data.wind.speed + " MPH");
        $("#today-humid").text("Humidity: " + data.main.humidity + " %");
        $("#today-UV").text()
    })
}

function fiveDayWeather (city){
    fetch (forcastUrl + city + "&units=imperial&appid=" +APIkey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (i=0; i<5; i++) {
            var j = 7 + (8*i)
            $("#five-day-date" + i).text( moment(data.list[j].dt, "X").format("L"));
            $("#five-day-img" + i).attr("src", iconUrlStart + data.list[j].weather[0].icon + iconUrlEnd);
            $("#five-day-temp" + i).text("Temp: " + data.list[j].main.temp +"F");
            $("#five-day-wind" + i).text("Wind: " + data.list[j].wind.speed + "MPH");
            $("#five-day-humid" + i).text("Humidity: " + data.list[j].main.humidity + "%");
        }
    })
}
