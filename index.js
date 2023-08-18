import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "6de9af58cfd761721cbdb6ce2dfbbec3";
const date = new Date();
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

const day = date.toLocaleString('en-IN', options); // Replace with your API key

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  const place = req.body.searchbar;

  try {
    const result = await axios.get(API_URL, {
      params: {
        q: place,
        appid: API_KEY,
        units: "metric",
      },
    });

    // Redirect the user to the weather route
    res.redirect(`/weather/${encodeURIComponent(place)}`);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.render("index.ejs", { content: "Oops! Location is not valid..." });
  }
});

app.get("/weather/:place", async (req, res) => {
  const { place } = req.params;

  try {
    const result = await axios.get(API_URL, {
      params: {
        q: place,
        appid: API_KEY,
        units: "metric",
      },
    });

    // ... Extract data as before
    const icon = result.data.weather[0].icon;
    const description = result.data.weather[0].description;
    const temp = result.data.main.temp;
    const Name = result.data.name;
    const sunriseTimestamp = result.data.sys.sunrise;

    // Create a date object from the sunrise timestamp
    const sunriseDate = new Date(sunriseTimestamp * 1000);

    // Get the time portion of the sunrise date
    const sunriseTime = sunriseDate.toLocaleTimeString();

    const sunsetTimestamp = result.data.sys.sunset;

    // Create a date object from the sunset timestamp
    const sunsetDate = new Date(sunsetTimestamp * 1000);

    // Get the time portion of the sunset date
    const sunsetTime = sunsetDate.toLocaleTimeString();

    res.render("weather.ejs", {
      // Pass weather data to the template
      wplace: place,
      // ... Other weather data
     
      Today: day,
      wicon : icon,
         wdescription : description,
         wtemp :temp,
         Today : day,
         wplace : Name,
         humidity : result.data.main.humidity,
         maxtemp : result.data.main.temp_max,
         mintemp : result.data.main.temp_min,
         pressure : result.data.main.pressure,
         windspeed : result.data.wind.speed,
         feelslike : result.data.main.feels_like,
         gust : result.data.wind.gust,
         wdeg : result.data.wind.deg,
         latitude : result.data.coord.lat,
         longitude : result.data.coord.lon,
         sunrise : sunriseTime,
         sunset : sunsetTime,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.render("index.ejs", { content: "Oops! Something went wrong..." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
