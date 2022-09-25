var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var APIkey = "172ecdfeb9ed3b4659678bbef29c9bdf";
var iconUrlStart = "http://openweathermap.org/img/wn/"
var iconUrlEnd = "@2x.png"

var citySearch = $("#city-search")
var searchButton = $("#search-button")

var searchHistoryArray = [];

function init (){
    searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    console.log(localStorage.getItem("weatherSearchHistory"))
    console.log(searchHistoryArray)
    if (searchHistoryArray !== null){
        showHistory()
    }
}
init()

function showHistory (){
    for (i=0; i<storedSearchHistory.length; i++) {
        var button = $("<button>").text(storedSearchHistory[i]);
        $("previous-search").append(button);
    }
}


searchButton.on("click", getWeatherData)

function getWeatherData(event) {
    event.preventDefault();
    var selectedCity = citySearch.val();
    console.log(selectedCity);
    console.log(searchHistoryArray);
    searchHistoryArray.push(selectedCity);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistoryArray))
    todaysWeather(selectedCity);
    fiveDayWeather(selectedCity);

}

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
