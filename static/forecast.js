function weatherCodeToGroup(code) {

    // Sunny(ฟ้าใสหรือเมฆบางส่วน) / WMO code
    if (code === 0 || code === 1 || code === 2) {
        return "Sunny";
    }
    // Cloudy(เมฆมาก,หมอก) / WMO code
    if ([3, 45, 48].includes(code)) {
        return "Cloudy";
    }
    // Raining(สบฝน) / WMO code
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code) ||
        [71, 73, 75, 77, 85, 86].includes(code)) {
        return "Raining";
    }
    //ถ้าไม่รู้จักให้เป็นCloudy
    return "Cloudy";
}

//เพิ่มไอคอนรูป
const weatherIcons = {
    "Sunny": '/static/sunny.PNG',
    "Cloudy": '/static/cloudy.PNG',
    "Raining": '/static/raining.PNG',
    "Unknown": '/static/cloudy.PNG'
};

// main function
window.initForecastApp = function (modalBody) {
    console.log("forecast.js: initForecastApp(modalBody) is running...");

    //Date,Month
    try {
        const today = new Date();
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
        const monthName = today.toLocaleDateString("en-US", { month: "long" });
        const dayNumber = today.getDate();

        const dateEl = modalBody.querySelector('#forecast-date');
        if (dateEl) {
            dateEl.textContent = `${dayName}, ${monthName} ${dayNumber}`;
        } else {
            console.warn("forecast.js: Could not find #forecast-date element.");
        }
    } catch (err) {
        console.error("forecast.js: Error setting date:", err);
    }

    // ตั้งค่าAPI, ดึงข้อมูล
    const latitude = 13.7259;
    const longitude = 100.7760;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`;
    const tempEl = modalBody.querySelector('#forecast-temp');
    const descEl = modalBody.querySelector('#forecast-desc');
    const iconEl = modalBody.querySelector('#weather-icon');

    if (!tempEl || !descEl || !iconEl) {
        console.error("forecast.js: Could not find forecast display elements. Make sure forecast.html is correct.");
        return;
    }

    tempEl.textContent = "--°C";
    descEl.textContent = "Loading...";
    iconEl.src = weatherIcons["Unknown"];

    // ดึงข้อมูลจาก API
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode;
            const weatherGroup = weatherCodeToGroup(code);
            const iconImg = weatherIcons[weatherGroup];

            tempEl.textContent = `${Math.round(temp)}°C`;
            descEl.textContent = `Conditions: ${weatherGroup}`;
            iconEl.src = iconImg;
            iconEl.alt = weatherGroup;

        })
        .catch(err => {
            console.error("forecast.js: Failed to fetch weather:", err);
            tempEl.textContent = "Failed";
            descEl.textContent = "Could not load data.";
            iconEl.src = weatherIcons["Unknown"];
        });
}
