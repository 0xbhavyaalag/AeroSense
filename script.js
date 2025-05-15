// OpenWeatherMap API configuration
const API_KEY = 'f1c8a0c5c5c5c5c5c5c5c5c5c5c5c5c5'; // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const currentTime = document.getElementById('current-time');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feels-like');
const visibility = document.getElementById('visibility');
const clouds = document.getElementById('clouds');

// Update current time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentTime.textContent = timeString;
}

// Update time every minute
setInterval(updateTime, 60000);
updateTime();

// Fetch weather data
async function fetchWeatherData(location) {
    try {
        const response = await fetch(`${API_URL}?q=${location}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error('Error:', error);
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    cityName.textContent = data.name;
    temp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    clouds.textContent = `${data.clouds.all}%`;
}

// Get weather by city name
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherData(location);
    }
});

// Get weather by current location
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoords(latitude, longitude);
            },
            (error) => {
                alert('Unable to retrieve your location');
                console.error('Error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

// Fetch weather by coordinates
async function fetchWeatherDataByCoords(lat, lon) {
    try {
        const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error('Error:', error);
    }
}

// Allow search on Enter key
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherData(location);
        }
    }
});

// Get weather for default location (New York) on page load
fetchWeatherData('New York'); 