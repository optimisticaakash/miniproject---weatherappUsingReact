import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
  let [city, SetCity] = useState("");
  let [error, setError] = useState(false);
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "5a220eec7a40d7061c7e6cccc9f2ac12";

  let getWeatherInfo = async (cityName) => {
    let response = await fetch(
      `${API_URL}?q=${cityName}&APPID=${API_KEY}&units=metric`,
    );
    let jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(jsonResponse.message || "Unable to fetch weather data");
    }

    let result = {
      city: jsonResponse.name,
      temp: jsonResponse.main.temp,
      tempMin: jsonResponse.main.temp_min,
      tempMax: jsonResponse.main.temp_max,
      humidity: jsonResponse.main.humidity,
      feelsLike: jsonResponse.main.feels_like,
      weather: jsonResponse.weather[0].description,
    };

    return result;
  };

  let handleChange = (event) => {
    SetCity(event.target.value);
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedCity = city.trim();

    if (!trimmedCity) return;

    try {
      setError(false);
      let newInfo = await getWeatherInfo(trimmedCity);
      updateInfo(newInfo);
      SetCity("");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="SearchBox">
      <h3>Search for the weather</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <Button variant="contained" type="submit" endIcon={<SendIcon />}>
          Send
        </Button>
        {error && <p style={{ color: "red" }}>No such place exist</p>}
      </form>
    </div>
  );
}
