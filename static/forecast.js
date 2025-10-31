// static/forecast.js

/**
 * 1. ฟังก์ชันแปล WMO weather code (🌟 แก้ไขตามที่ขอ)
 * ปรับให้เหลือแค่: Sunny, Cloudy, Raining
 */
function weatherCodeToGroup(code) {
  
  // 1. "Sunny" (สำหรับฟ้าใส หรือเมฆบางส่วน)
  // WMO code 0, 1, 2 = Clear, Mainly clear, Partly cloudy
  if (code === 0 || code === 1 || code === 2) {
    return "Sunny";
  }
  
  // 2. "Cloudy" (สำหรับเมฆมาก, หมอก)
  // WMO code 3, 45, 48 = Cloudy, Fog
  if ([3, 45, 48].includes(code)) {
    return "Cloudy";
  }

  // 3. "Raining" (สำหรับฝน หรือ หิมะ - เอามารวมกัน)
  // WMO code 51-99 (Rain/Drizzle/Hail) และ 71-86 (Snow)
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code) || 
      [71, 73, 75, 77, 85, 86].includes(code)) {
    return "Raining";
  }
  
  // 4. ถ้าไม่รู้จัก ให้เป็น "Cloudy"
  return "Cloudy"; 
}

/**
 * 2. Object สำหรับ map กลุ่มอากาศ ไปยังไฟล์ไอคอน
 * 🌟 แก้ไขให้ตรงกับฟังก์ชันด้านบน
 * (ผมแก้ไข "sunning" ที่คุณพิมพ์ผิดให้แล้วด้วยครับ)
 */
const weatherIcons = {
  // 🌟 เพิ่ม "Sunny"
  "Sunny": 'static/icons/sunny.png', 
  
  "Cloudy": 'static/icons/cloudy.png',
  "Raining": 'static/icons/raining.png',
  
  // 🌟 (ลบ "Clear", "Clear/Cloudy", "Snowing" ออกได้)
  // 🌟 "Unknown" ยังต้องมีไว้สำหรับตอน API error
  "Unknown": 'static/icons/cloudy.png' 
};

/**
 * 3. 🌟 ฟังก์ชันหลักที่จะถูกเรียกโดย script.js
 * (ส่วนนี้ไม่ต้องแก้ไขเลยครับ)
 */
window.initForecastApp = function(modalBody) {
  console.log("forecast.js: initForecastApp(modalBody) is running...");

  // --- 3.1 แสดงวันที่ปัจจุบัน ---
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

  // --- 3.2 ตั้งค่า API และดึงข้อมูล ---
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
      const weatherGroup = weatherCodeToGroup(code); // 🌟 จะ trả về "Sunny", "Cloudy", หรือ "Raining"
      const iconImg = weatherIcons[weatherGroup]; // 🌟 จะไปหา "sunny.png", "cloudy.png", ...

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