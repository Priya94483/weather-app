function getWeather() {
    let city = document.getElementById("cityInput").value.trim();
    let result = document.getElementById("weatherResult");
    if (city === "") {
        result.innerHTML = "<p class='error'>Please enter a city name.</p>";
        return;
    }
    result.innerHTML = "<p>Loading weather...</p>";
    let locationUrl =
        "https://geocoding-api.open-meteo.com/v1/search?name="
        + encodeURIComponent(city)
        + "&count=1&language=en&format=json";

    fetch(locationUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (!data.results || data.results.length === 0) {
                throw new Error("City not found");
            }
            let place = data.results[0];
            let latitude = place.latitude;
            let longitude = place.longitude;
            let cityName = place.name;
            let country = place.country;
            let weatherUrl =
                "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&current=temperature_2m,weather_code"
                + "&timezone=auto";
            return fetch(weatherUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(weatherData) {
                    return {
                        cityName: cityName,
                        country: country,
                        weather: weatherData.current
                    };
                });
        })
        .then(function(data) {
            let temperature = data.weather.temperature_2m;
            let weatherCode = data.weather.weather_code;
            let condition = getWeatherCondition(weatherCode);
            result.innerHTML = `
                <h2>${data.cityName}, ${data.country}</h2>
                <p class="temperature">
                    ${temperature} °C
                </p>
                <p class="condition">
                    ${condition}
                </p>
            `;
        })
        .catch(function(error) {
            result.innerHTML =
                "<p class='error'>Unable to get weather information. Please try again.</p>";
            console.log(error);
        });
}
function getWeatherCondition(code) {
    if (code === 0) {
        return "Clear Sky";
    }
    if (code === 1 || code === 2 || code === 3) {
        return " Partly Cloudy";
    }
    if (code === 45 || code === 48) {
        return "Foggy";
    }
    if (code === 51 || code === 53 || code === 55) {
        return "Drizzle";
    }
    if (code === 61 || code === 63 || code === 65) {
        return "Rainy";
    }
    if (code === 71 || code === 73 || code === 75) {
        return "Snowy";
    }
    if (code === 80 || code === 81 || code === 82) {
        return "Rain Showers";
    }
    if (code === 95 || code === 96 || code === 99) {
        return " Thunderstorm";
    }
    return "Cloudy";
}