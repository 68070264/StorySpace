function showPopup() {
  const width = 300;
  const height = 400;
  const url = 'popup.html'; // แทนที่ด้วย URL ของหน้าที่คุณต้องการให้แสดงในป๊อปอัป หรือใช้ 'about:blank' เพื่อหน้าว่าง

  // การคำนวณตำแหน่งเพื่อให้ป๊อปอัปอยู่กึ่งกลางหน้าจอ (ไม่จำเป็น แต่ช่วยให้ดูดีขึ้น)
  const left = (screen.width / 2) - (width / 2);
  const top = (screen.height / 2) - (height / 2);

  // กำหนดคุณสมบัติของหน้าต่างป๊อปอัป
  const features = `
    width=${width},
    height=${height},
    top=${top},
    left=${left},
    resizable=yes,    // อนุญาตให้ปรับขนาดได้
    scrollbars=yes,   // แสดงแถบเลื่อนถ้าเนื้อหาเกิน
    toolbar=no,       // ไม่แสดงแถบเครื่องมือ
    menubar=no,       // ไม่แสดงแถบเมนู
    location=no,      // ไม่แสดงช่องที่อยู่ URL
    status=no         // ไม่แสดงแถบสถานะ
  `;

  // เปิดหน้าต่างป๊อปอัป
  window.open("todolist.html", 'PopupName', features);
}


// เพิ่ม
// 1. ดึงองค์ประกอบ HTML ที่เราต้องใช้มา
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close-button")[0];

// 2. เมื่อคลิกที่รูปภาพ ให้เปิด Pop-up
btn.onclick = function() {
  modal.style.display = "block";
}

// 3. เมื่อคลิกที่ปุ่มปิด (x) ให้ซ่อน Pop-up
span.onclick = function() {
  modal.style.display = "none";
}

// 4. เมื่อคลิกนอกกรอบ Pop-up ให้ซ่อน Pop-up ด้วย
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}