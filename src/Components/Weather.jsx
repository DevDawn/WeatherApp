import React, { useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const [city, setCity] = useState(''); // For the search input
    const [weatherData, setWeatherData] = useState(null); // For weather data

    const allIcons = {
        "hot": clear_icon,   // Hot weather
        "warm": cloud_icon,  // Warm weather
        "cool": drizzle_icon, // Cool weather
        "cold": snow_icon,   // Cold weather
        // Other icons can be added as needed
    };

    const getWeatherIcon = (temperature) => {
        if (temperature > 30) {
            return allIcons.hot; // Hot weather
        } else if (temperature > 20) {
            return allIcons.warm; // Warm weather
        } else if (temperature > 10) {
            return allIcons.cool; // Cool weather
        } else {
            return allIcons.cold; // Cold weather
        }
    };

    const fetchLocationData = async (cityName) => {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                const latitude = location.latitude;
                const longitude = location.longitude;

                // Fetch the weather data using latitude and longitude
                fetchWeatherData(latitude, longitude, location.admin1+"/"+location.country);
            } else {
                console.log("No results found.");
                setWeatherData(null); // Clear weather data if no results
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    const fetchWeatherData = async (latitude, longitude, cityName) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            const temperature = data.current_weather.temperature;
            setWeatherData({
                temperature: temperature,
                windSpeed: data.current_weather.windspeed,
                humidity: data.current_weather.humidity,
                location: cityName,
                icon: getWeatherIcon(temperature) // Use the temperature-based icon
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const handleSearch = () => {
        if (city) {
            fetchLocationData(city);
        }
    };

    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder='City...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={handleSearch}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity}30%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/hr</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className='Error-Text'>Please search for a city to get weather data</p>
            )}
        </div>
    );
};

export default Weather;
