var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var APIkey = "172ecdfeb9ed3b4659678bbef29c9bdf";
var iconUrlStart = "http://openweathermap.org/img/wn/"
var iconUrlEnd = "@2x.png"

var citySearch = $("#city-search")
var searchButton = $("#search-button")

var searchHistoryArray = [];
var storedSearchHistory =[]
var selectedCity

function init (){
    //retrieve search history data from local storage
    storedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    if (storedSearchHistory !== null){
        searchHistoryArray = storedSearchHistory
        //if stored search history isn't empty, update working history array and call function to populate the search history buttons
        showHistory()
    }
}
init()

//Display previous search items and add event handlers to them
function showHistory (){
    //select div where buttons will be populated
    $("#previous-search").empty();
    //loop through each stored search item and create a button
    for (i=0; i<searchHistoryArray.length; i++) {
        var button = $("<button></button>").text(searchHistoryArray[i]).addClass("history-button btn btn-secondary");
        $("#previous-search").append(button);
    }
    //add event handlers to buttons
    var prevSearches = $(".history-button");
    prevSearches.on("click", function(event) {
        event.preventDefault;
        //Retrieve city name from selected button
        selectedCity = $(event.target).text();
        //remove the hiden class for the weather display field
        $("#hide-on-start").removeClass("d-none")
        //call the two api processes
        todaysWeather(selectedCity);
        fiveDayWeather(selectedCity);
        
    })
}

//create event handler for search button
searchButton.on("click", function(event) {
    event.preventDefault();
    selectedCity = citySearch.val();
    //value from input field is used as parameter for the api functions
    todaysWeather(selectedCity);
    fiveDayWeather(selectedCity);
})

//get today's forcast 
function todaysWeather (city){
    //call api using city as a parameter
    fetch(todayUrl + city + "&units=imperial&appid=" + APIkey)
    .then(function (response) {
        //if the api response is not ok return from function
        if(!response.ok) {
            return
        }
        $("#hide-on-start").removeClass("d-none");
        return response.json();
    })
    .then(function (data) {
        //if searchHistoryArray does not already contain the selected value, add the selected city to the array (using data.name to normalize capitalization), update local storage, and update search history
        if (!searchHistoryArray.includes(data.name)) {
            searchHistoryArray.push(data.name);
            localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistoryArray));
            showHistory();
        }
        //access each of the text fields via id and set them according to the data response
        $("#today-loc").text(data.name +" ("+ moment(data.dt, "X").format("L") +")");
        //plugs in the icon id to the icon url structure 
        $("#today-icon").attr("src", iconUrlStart + data.weather[0].icon + iconUrlEnd)
        $("#today-temp").text("Temp: " + data.main.temp + "°F");
        $("#today-wind").text("Wind: " + data.wind.speed + " MPH");
        $("#today-humid").text("Humidity: " + data.main.humidity + " %");
    })
}

//get five day weather forcast
function fiveDayWeather (city){
    fetch (forcastUrl + city + "&units=imperial&appid=" +APIkey)
    .then(function (response) {
        //check to see if a valid response is returned
        if(!response.ok) {
            return
        }
        return response.json();
    })
    .then(function (data) {
        //Loop through the data to populate text fields for each of the 5 days
        for (i=0; i<5; i++) {
            //5 day forcast info is provided in 3 hour chunks so ever 8 data enteries represents 24 hours
            var j = 7 + (8*i)
            $("#five-day-date" + i).text( moment(data.list[j].dt, "X").format("L"));
            $("#five-day-img" + i).attr("src", iconUrlStart + data.list[j].weather[0].icon + iconUrlEnd);
            $("#five-day-temp" + i).text("Temp: " + data.list[j].main.temp +"°F");
            $("#five-day-wind" + i).text("Wind: " + data.list[j].wind.speed + " MPH");
            $("#five-day-humid" + i).text("Humidity: " + data.list[j].main.humidity + "%");
        }
    })
}
