import React, { useState } from 'react';

const WeatherPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "6d83156e4e40ca97d0c6924b832fe00c";  // Replace with your actual API key
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  // Image URLs instead of imports
  const cloudImg = "https://png.pngtree.com/png-clipart/20230307/original/pngtree-fluffy-bright-blue-clouds-png-image_8975467.png";
  const rainImg = "https://www.pinclipart.com/picdir/big/568-5683204_cloud-and-rain-png-clipart.png";
  const clearImg = "https://www.transparentpng.com/thumb/sky/tfjrhN-sky-clouds-sun-blue-ftestickers-background.png";
  const hazeImg = "https://cdn4.iconfinder.com/data/icons/weather-2-10/512/2_weather_cloudy_cloud_haze-512.png"; // New haze image
  const errImg = "https://www.freeiconspng.com/uploads/sign-red-error-icon-1.png";

  const handleInput = (event) => {
    setSearch(event.target.value);
  };

  const myFun = async () => {
    if (!search) {
      setError("Please Enter City Name");
      return;
    }

    const get = await fetch(`${API_URL}?q=${search}&appid=${API_KEY}&units=metric`);
    const jsonData = await get.json();

    if (jsonData.cod === '404') {
      setError("Please Enter a Valid City Name!");
      setData(null);
    } else {
      setError("");
      setData(jsonData);
    }

    setSearch("");
  };

  // Function to get the appropriate image based on the weather condition
  const getWeatherImage = (condition) => {
    switch (condition) {
      case "Clouds":
        return cloudImg;
      case "Rain":
        return rainImg;
      case "Clear":
        return clearImg;
      case "Mist":
        return hazeImg;  // Updated to use the new haze image
      default:
        return null;
    }
  };

  return (
    <div className='container'>
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            margin: 0;
          }

          .inputs {
            margin-bottom: 20px;
          }

          .inputs input {
            padding: 12px;
            width: 300px;
            border-radius: 25px;
            border: 1px solid #ccc;
            font-size: 16px;
            margin-right: 10px;
            transition: all 0.3s;
          }

          .inputs input:focus {
            border-color: #4CAF50;
            outline: none;
          }

          .inputs button {
            padding: 12px 20px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            transition: all 0.3s;
          }

          .inputs button:hover {
            background-color: #45a049;
            transform: scale(1.05);
          }

          .errorPage {
            color: red;
            font-size: 18px;
            margin: 20px 0;
          }

          .weathers {
            margin-top: 20px;
          }

          .cityName {
            font-size: 24px;
            font-weight: bold;
          }

          .temperature {
            font-size: 40px;
          }

          .climate {
            font-size: 18px;
          }

          .weatherDetails {
            font-size: 18px;
            margin-top: 10px;
          }

          img {
            width: 100px;
            height: 100px;
            margin-top: 10px;
          }

          @media (max-width: 768px) {
            .inputs input, .inputs button {
              width: 80%;
              margin: 10px auto;
            }
          }
        `}
      </style>

      <div className='inputs'>
        <input
          placeholder='Enter city, Country'
          value={search}
          onChange={handleInput}
        />
        <button onClick={myFun}>
          <i className="fa-solid fa-magnifying-glass"></i> Search
        </button>
      </div>

      {error && (
        <div className='errorPage'>
          <p>{error}</p>
          <img src={errImg} alt="error" />
        </div>
      )}

      {data && data.weather && (
        <div className='weathers'>
          <h2 className='cityName'>{data.name}</h2>

          {/* Display only the weather image based on the condition */}
          <img
            src={getWeatherImage(data.weather[0].main)}
            alt={data.weather[0].main}
          />

          <h2 className='temperature'>{Math.trunc(data.main.temp)}°C</h2>
          <p className='climate'>{data.weather[0].description}</p>

          <div className='weatherDetails'>
            <p><strong>Humidity:</strong> {data.main.humidity}%</p>
            {data.rain ? <p><strong>Precipitation:</strong> {data.rain["1h"]} mm</p> : <p><strong>Precipitation:</strong> None</p>}
            <p><strong>Cloudiness:</strong> {data.clouds.all}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
