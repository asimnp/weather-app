const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express Config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

// Home
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Alex Doe"
  });
});

// About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Alex Doe"
  });
});

// Help
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "How can I help you?",
    title: "Help",
    name: "Alex Doe"
  });
});

// Weather
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    });
  }
  // geocode
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error
        });
      }

      // forecast
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

// Products
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query);
  res.send({
    products: []
  });
});

// help anything
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help Article",
    name: "Alex Doe",
    errorMessage: "Help article not found."
  });
});

// 404
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Alex Doe",
    errorMessage: "Page not found."
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000...");
});
