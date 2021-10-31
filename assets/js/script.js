var currentDate = moment().format("MM/DD/YYYY");
var city = document.getElementById("city");
var cityQuery = document.getElementById("citySearch");
var searchBtn = document.getElementById("searchBtn");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uvIndex = document.getElementById("uvIndex");
var cards = document.getElementById("forecastCards");
var searchHistory = document.getElementById("searchHistory");

var savedCities = []

var geoCord = "http://api.openweathermap.org/geo/1.0/direct?limit=1&appid=be42f8237631c96e686a5fc924ebe9dd"
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?appid=8d7a67ef47192bdaaee4e3e539a24175";




function getWeather(query) {
      var url= geoCord + `&q=${query}`
      fetch(url).then(function(res){
        res.json().then(function(data){
            var cityName = data[0].name
            var lat = data[0].lat
            var lon = data[0].lon
            var url= weatherApiUrl + `&lat=${lat}&lon=${lon}`
            fetch(url).then(function(res){
                res.json().then(function(data){
                    displayWeather(data, cityName)
                })
            }).catch(function(error){
                console.log(error)
            })
        })
      }).catch(function(error){
          console.log(error)
      })
};

function displayWeather(weather, cityName){
    var icon = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
    city.innerHTML = `${cityName} (${currentDate}) <img class="img-fluid" src="${icon}" alt="${weather.current.weather[0].description}"/>`
    console.log(weather)
    temp.innerHTML = `${Math.floor((weather.current.temp-273.15) * (9/5) +32)} &#8457;`;
    wind.innerHTML = weather.current.wind_speed
    humidity.innerHTML = weather.current.humidity
    uvIndex.innerHTML = weather.current.uvi
    var colors = ["#8BD448","#8BD448", "#FAE442", "#FAE442", "#FBA949", "#FBA949", "#FF6355", "#FF6355", "#9C4F96", "#9C4F96"]
        if(weather.current.uvi<0) { 
            uvIndex.style.backgroundColor = colors[0]
        } else if(weather.current.uvi>10) {
            uvIndex.style.backgroundColor = colors[9]
        } else {
            console.log(Math.floor(weather.current.uvi))
            uvIndex.style.backgroundColor = colors[Math.floor(weather.current.uvi)]
            console.log(colors[weather.current.uvi])
        }
};

function loadSearchHistory(loadCity) {
    var searchListEl = document.createElement("li");
    searchListEl.className = "search-history";
    var btn = document.createElement("button");
    btn.textContent = loadCity;
    btn.className = "btn btn-secondary"
    btn.addEventListener("click", function(){
        getWeather(loadCity)})
    searchListEl.append(btn)
    searchHistory.append(searchListEl)
};

// function suggested by byron to lowercase and join the searched city name
function citySearch(str) {
    var words = str.split(' ');
    var titleCaseWords = [];
  
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      titleCaseWords.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
    }
  
    return titleCaseWords.join(' ');
  };


  function loadCity() {
    var savedCitiesJSON = localStorage.getItem("searchHistory");
    // if there are no cities, set cities to an empty array and return out of the function
    if (!savedCitiesJSON) {
      return false;
    }
    console.log("Saved cities found!");
    // else, load up saved tasks
  
    // parse into array of objects
    savedCities = JSON.parse(savedCitiesJSON);
  
    // loop through savedCities array
    for (var i = 0; i < savedCities.length; i++) {
      // pass each task object into the `searchHistory` function
      loadSearchHistory(savedCities[i]);
    }
  };







  searchBtn.addEventListener("click", function(event){
    var text = cityQuery.value
    var query = citySearch(text)
    getWeather(query)
    savedCities.push(query)
    localStorage.setItem("searchHistory", JSON.stringify(savedCities));
    loadSearchHistory(query)
  });
  
  loadCity();