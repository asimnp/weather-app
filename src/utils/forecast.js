const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/61d06690477ab9b98d23ea80383b580e/${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location!", undefined);
    } else {
      const { temperature, precipProbability, humidity } = body.currently;

      callback(
        undefined,
        `${body.daily.data[0].summary} It is currently ${temperature} degree out.There is ${precipProbability}% of chance of rain. And humidity is ${humidity}%`
      );
    }
  });
};

module.exports = forecast;
