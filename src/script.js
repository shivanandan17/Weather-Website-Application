// Define the API keys
const weatherApiKey = "1f0ade8bce625b4947e7a2a7f9f2c66b";
const geocodeApiKey = "ba1d79582f504eef902b9dd030b45a30";

// Function to fetch weather data from OpenWeatherMap API
function fetchWeather(city) {
  // Construct the URL for the weather API request
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    weatherApiKey;

  // Fetch weather data from the API
  fetch(weatherUrl)
    .then((response) => {
      // Check if the API response is successful
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => displayWeather(data)); // Call the displayWeather function with the data
}

// Function to display weather information
function displayWeather(data) {
  // Extract data from the API response
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  // Update the HTML elements with the weather information
  document.querySelector(".city-name").innerText = "Weather in " + name;
  document.querySelector(".weather-icon").src =
    "https://openweathermap.org/img/wn/" + icon + ".png";
  document.querySelector(".description-text").innerText = description;
  document.querySelector(".temperature").innerText = temp + "°C";
  document.querySelector(".humidity-info").innerText =
    "Humidity: " + humidity + "%";
  document.querySelector(".wind-info").innerText =
    "Wind speed: " + speed + " km/h";

  // Remove the loading class to display the weather information
  document.querySelector(".weather-info").classList.remove("loading");

  // Set the background image based on the city name using Unsplash
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + name + "')";
}

// Function to fetch location data from OpenCageData Geocoder
function reverseGeocode(latitude, longitude) {
  // Construct the URL for reverse geocoding API request
  const geocodeUrl =
    "https://api.opencagedata.com/geocode/v1/json" +
    "?" +
    "key=" +
    geocodeApiKey +
    "&q=" +
    encodeURIComponent(latitude + "," + longitude) +
    "&pretty=1" +
    "&no_annotations=1";

  // Create an XMLHttpRequest object for the geocoding request
  const request = new XMLHttpRequest();
  request.open("GET", geocodeUrl, true);

  // Define the onload function to handle the geocoding response
  request.onload = function () {
    if (request.status == 200) {
      // Parse the JSON response
      const data = JSON.parse(request.responseText);

      // Fetch weather data for the city from the geocoding response
      fetchWeather(data.results[0].components.city);
    } else if (request.status <= 500) {
      console.log("Unable to geocode! Response code: " + request.status);
      const data = JSON.parse(request.responseText);
      console.log("Error message: " + data.status.message);
    } else {
      console.log("Server error");
    }
  };

  // Define the onerror function to handle any connection errors
  request.onerror = function () {
    console.log("Unable to connect to the server");
  };

  // Send the geocoding request
  request.send();
}

// Function to get user's geolocation
function getLocation() {
  // Define the success function for geolocation
  function success(data) {
    // Call reverseGeocode with the user's coordinates
    reverseGeocode(data.coords.latitude, data.coords.longitude);
  }

  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {
    // Get the user's current position and call the success function
    navigator.geolocation.getCurrentPosition(success, console.error);
  } else {
    // If geolocation is not supported, fetch weather for a default location
    fetchWeather("Coimbatore");
  }
}

// Event listeners for search button and Enter key
document.querySelector(".search-button").addEventListener("click", function () {
  fetchWeather(document.querySelector(".search-input").value);
});

document.querySelector(".search-input").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    fetchWeather(document.querySelector(".search-input").value);
  }
});

// Fetch weather for the default location
fetchWeather("Coimbatore");

// Get user's geolocation
getLocation();