const apiKey = "afbc99db955a3347823752de85e7e55a";
let map;

async function getWeather() {
    const cityInput = document.getElementById("cityInput").value.trim();
    const weatherResult = document.getElementById("weatherResult");
    const forecastResult = document.getElementById("forecastResult");
    const mapContainer = document.getElementById("map");

    weatherResult.innerHTML = "";
    forecastResult.innerHTML = "";
    mapContainer.style.display = "none";

    if (!cityInput) {
        weatherResult.innerHTML = `<p style="color: #ff6b6b;">Please enter a city name!</p>`;
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error("City not found");
        const weatherData = await weatherResponse.json();

        weatherResult.innerHTML = `
            <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
            <p><strong>🌡 Temperature:</strong> ${weatherData.main.temp}°C</p>
            <p><strong>☁️ Weather:</strong> ${weatherData.weather[0].description}</p>
            <p><strong>💧 Humidity:</strong> ${weatherData.main.humidity}%</p>
            <p><strong>🌬 Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        `;

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error("Forecast not found");
        const forecastData = await forecastResponse.json();

        const dailyForecasts = forecastData.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecasts.forEach(forecast => {
            forecastResult.innerHTML += `
                <div class="forecast-card">
                    <p><strong>${new Date(forecast.dt * 1000).toLocaleDateString()}</strong></p>
                    <p>${forecast.weather[0].description}</p>
                    <p>${forecast.main.temp}°C</p>
                </div>
            `;
        });

        const { lat, lon } = weatherData.coord;
        mapContainer.style.display = "block";

        if (!map) {
            map = L.map("map").setView([lat, lon], 10);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lon], 10);
        }

        L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${weatherData.name}</b><br>${weatherData.weather[0].description}`)
            .openPopup();

    } catch (error) {
        weatherResult.innerHTML = `<p style="color: #ff6b6b;">${error.message}</p>`;
    }
}
