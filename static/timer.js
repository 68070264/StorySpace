// static/timer.js

function initTimerApp(rootContainer) {
    console.log("initTimerApp() is called!");
  
    // 1) หาตัว DOM ภายใน "พื้นที่ที่เพิ่งถูก inject"
    const container = rootContainer
      ? rootContainer.querySelector('#timer-controller')
      : document.querySelector('#timer-controller');
  
    if (!container) {
      console.warn("timer.js: #timer-controller not found.");
      return;
    }
  
    // กันติดตั้งซ้ำเมื่อเปิดปิด popup หลายครั้ง
    if (container.dataset.listenerAttached === 'true') {
      console.log("timer.js: listeners already attached.");
      return;
    }
  
    const form    = container.querySelector('#timerForm');
    const stopBtn = container.querySelector('#stopBtn');
    const display = container.querySelector('#display');
    const status  = container.querySelector('#status');
    const hours   = container.querySelector('#hours');
    const minutes = container.querySelector('#minutes');
    const seconds = container.querySelector('#seconds');
  
    if (!form || !stopBtn || !display || !status) {
      console.error("timer.js: required elements are missing.");
      return;
    }
  
    let es = null;
  
    function stopStream() {
      if (es) {
        es.close();
        es = null;
        status.textContent = "Stopped";
      }
    }
  
    // 2) ติดตั้ง event listeners (ครั้งเดียว)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      stopStream();
  
      const h = parseInt(hours?.value || "0", 10);
      const m = parseInt(minutes?.value || "0", 10);
      const s = parseInt(seconds?.value || "0", 10);
      const totalSeconds = (h * 3600) + (m * 60) + s;
  
      if (totalSeconds <= 0) {
        alert("กรุณาใส่เวลาอย่างน้อย 1 วินาที");
        return;
      }
  
      display.textContent = "connecting...";
      status.textContent   = "Connecting...";
  
      es = new EventSource(`/api/timer-stream?seconds=${totalSeconds}`);
  
      es.onmessage = (evt) => {
        display.textContent = evt.data;
        status.textContent  = "Running...";
      };
  
      es.addEventListener('done', (evt) => {
        display.textContent = evt.data || "Time's up!";
        status.textContent  = "✅ Finished";
        alert("⏰ Time's up!");
        stopStream();
      });
  
      es.onerror = () => {
        status.textContent = "Connection error";
        stopStream();
      };
    });
  
    stopBtn.addEventListener('click', stopStream);
  
    container.dataset.listenerAttached = 'true';
  }
  
  // เปิดหน้า timer.html โดยตรง (ไม่ผ่าน popup) ให้บูตเอง
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#timer-controller')) {
      initTimerApp();
    }
  });
  
  // export ให้ script เปิด popup เรียกได้
  window.initTimerApp = initTimerApp;
  