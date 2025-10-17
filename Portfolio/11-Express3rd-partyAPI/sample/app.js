const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = 3000;
const apiKey = "0eb236864225d9ff4ff3002a4037fe61";


app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/weather", (req, res) => {
  const city = req.body.cityName;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const https = require('https');

  https.get(url, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", () => {
      try {
        const weather = JSON.parse(data);
        if (weather.cod !== 200) {
          res.send(`<h1>Error: ${weather.message}</h1><a href="/">Go back</a>`);
          return;
        }
        const temp = weather.main.temp;
        const desc = weather.weather[0].description;
        const icon = weather.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        res.send(`
          <h1>Weather in ${city}</h1>
          <h2>${temp} °C</h2>
          <p>${desc}</p>
          <img src="${iconUrl}" alt="${desc}">
          <br><a href="/">Go back</a>
        `);
      } catch (err) {
        res.send(`<h1>Error: ${err.message}</h1><a href="/">Go back</a>`);
      }
    });
  }).on("error", (err) => {
    res.send(`<h1>Error: ${err.message}</h1><a href="/">Go back</a>`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
