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
                + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
                + "&timezone=auto";

            return fetch(weatherUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(weatherData) {

                    return {
                        cityName: cityName,
                        country: country,
                        weather: weatherData
                    };
                });
        })
        .then(function(data) {

            let weather = data.weather.current;

            let temperature = weather.temperature_2m;
            let humidity = weather.relative_humidity_2m;
            let windSpeed = weather.wind_speed_10m;
            let weatherCode = weather.weather_code;

            let condition = getWeatherCondition(weatherCode);

            document.getElementById("weatherResult").innerHTML = `
                <h2>${data.cityName}, ${data.country}</h2>

                <p class="weather-info">
                    🌡 Temperature: ${temperature} °C
                </p>

                <p class="weather-info">
                    ☁ Weather: ${condition}
                </p>

                <p class="weather-info">
                    💧 Humidity: ${humidity}%
                </p>

                <p class="weather-info">
                    💨 Wind Speed: ${windSpeed} km/h
                </p>
            `;
        })
        .catch(function(error) {

            document.getElementById("weatherResult").innerHTML =
                "<p class='error'>City not found. Please try another city.</p>";

            console.log(error);
        });
}


function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Partly cloudy";
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
        return "Rain showers";
    }

    if (code === 95) {
        return "Thunderstorm";
    }

    return "Cloudy";
}