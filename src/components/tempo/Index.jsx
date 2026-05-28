import './tempo.css';
import { useState, useEffect } from 'react';

export default function Weather() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6d9cf7e1077b9b62e8e5596d81e1ef66&units=metric`;

  useEffect(() => {
    if (lat && lon) {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [apiUrl, lat, lon]);


  return (
    <div className="weather">
      <h2>Weather Component</h2>
      <div className="weather-inputs">
        <label htmlFor="latitude">Latitude</label>
        <input type="number" id="latitude" step="0.01" onChange={(e) => setLat(parseFloat(e.target.value))} />
        <label htmlFor="longitude">Longitude</label>
        <input type="number" id="longitude" step="0.01" onChange={(e) => setLon(parseFloat(e.target.value))} />
      </div>
      <div className="weather-data">
        {weatherData ? (
          <div>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Weather: {weatherData.weather[0].description}</p>
          </div>
        ) : (
          <p className="small">Enter latitude and longitude to get weather data.</p>
        )}
      </div>
    </div>
  );
}