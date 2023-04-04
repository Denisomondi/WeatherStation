const API_KEY = 'f7093e7853be493e407d46a434f9c54b'; // Replace with your API key
const weatherContainer = document.getElementById('weather-container');
const locationInput = document.getElementById('location-input');
const unitToggle = document.getElementById('unit-toggle');
const units = {
  metric: 'C',
  imperial: 'F'
};
let currentUnit = 'metric';

// Function to fetch weather data for a location
// async function fetchWeatherData(location) {
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${currentUnit}&appid=${API_KEY}`;
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Unable to fetch weather data');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// }

function fetchWeatherData(location) {
    const API_KEY = 'f7093e7853be493e407d46a434f9c54b';
    const units = 'metric'; // or 'imperial' for Fahrenheit
  
    // construct the API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${API_KEY}`;
  
    // make the API request
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // update the UI with the weather data
        updateWeatherUI(data);
      })
      .catch(error => {
        console.error('There was a problem fetching the weather data:', error);
      });
  }
  

// Function to update the weather display
function updateWeatherDisplay(data) {
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const location = data.name;
  const icon = data.weather[0].icon;
  weatherContainer.innerHTML = `
    <h2>${location}</h2>
    <p>${temperature} &deg;${units[currentUnit]}</p>
    <p>${description}</p>
    <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
  `;
}

// Function to handle location search
async function handleLocationSearch() {
  const location = locationInput.value;
  const weatherData = await fetchWeatherData(location);
  updateWeatherDisplay(weatherData);
}

// Function to handle unit toggle
async function handleUnitToggle() {
  currentUnit = unitToggle.checked ? 'imperial' : 'metric';
  const location = locationInput.value;
  const weatherData = await fetchWeatherData(location);
  updateWeatherDisplay(weatherData);
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  handleLocationSearch();
});

// Event listener for location search form submit
document.getElementById('location-form').addEventListener('submit', (event) => {
  event.preventDefault();
  handleLocationSearch();
});

// Event listener for unit toggle change
unitToggle.addEventListener('change', () => {
  handleUnitToggle();
});
