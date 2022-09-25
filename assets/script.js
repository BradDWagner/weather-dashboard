var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var APIkey = "172ecdfeb9ed3b4659678bbef29c9bdf";
var lat;
var lon;
var iconUrlStart = "http://openweathermap.org/img/wn/"
var iconUrlEnd = "@2x.png"

var citySearch = $("#city-search")
var searchButton = $("#search-button")


searchButton.on("click", getWeatherData)




function getWeatherData(event) {
    event.preventDefault();
    var city = citySearch.val();
    //add city to local storage
    fetch(todayUrl + city + "&units=imperial&appid=" + APIkey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // lat = data.coord.lat;
        // lon = data.coord.lon;
        $("#today-loc").text(data.name +" "+ moment(data.dt, "X").format("L"));
        $("#today-icon").attr("src", iconUrlStart + data.weather[0].icon + iconUrlEnd)
        console.log("src", '"' + iconUrlStart + data.weather[0].icon + iconUrlEnd +'"')
        $("#today-temp").text("Temp: " + data.main.temp + "F");
        $("#today-wind").text("Wind: " + data.wind.speed + " MPH");
        $("#today-humid").text("Humidity: " + data.main.humidity + " %");
        $("#today-UV").text()
    })

fetch (forcastUrl + city + "&cnt=5&units=imperial&appid=" +APIkey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
}
