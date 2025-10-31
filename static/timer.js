// static/timer.js
function initTimerApp(rootContainer) {
  console.log("initTimerApp() is called!");

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

  function clearSavedEnd() {
    localStorage.removeItem('timerEndAt');
  }

  function stopStream() {
    if (es) {
      es.close();
      es = null;
    }
    status.textContent = "Stopped";
    // ถ้ากด Stop ถือว่าจบ session นี้
    clearSavedEnd();
  }

  function startStream(totalSeconds) {
    // กันซ้อน
    if (es) { es.close(); es = null; }

    if (totalSeconds <= 0) {
      display.textContent = "00:00:00";
      status.textContent  = "Ready";
      clearSavedEnd();
      return;
    }

    display.textContent = "connecting...";
    status.textContent  = "Connecting...";

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
      // ไม่ลบ timerEndAt ทันที เผื่อกลับมา resume ได้
      if (es) { es.close(); es = null; }
    };
  }

  // เริ่มใหม่จากฟอร์ม
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

    // บันทึกเวลาเป้าหมายไว้ใน localStorage
    const endAt = Date.now() + totalSeconds * 1000;
    localStorage.setItem('timerEndAt', String(endAt));

    startStream(totalSeconds);
  });

  stopBtn.addEventListener('click', stopStream);

  // ✅ Auto-resume: ถ้าเคยตั้งเวลาไว้และยังไม่หมด ให้ต่อเอง
  (function tryResume() {
    const saved = localStorage.getItem('timerEndAt');
    const endAt = saved ? parseInt(saved, 10) : 0;
    const remainMs = endAt - Date.now();
    const remainSec = Math.ceil(remainMs / 1000);

    if (remainSec > 0) {
      // กู้เวลาที่เหลือ
      startStream(remainSec);
    } else {
      // หมดแล้ว/ไม่มี ให้ล้าง state
      clearSavedEnd();
      display.textContent = "00:00:00";
      status.textContent  = "Ready";
    }
  })();

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
