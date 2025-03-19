// รอให้หน้าเว็บโหลด HTML และ DOM เสร็จก่อนรันโค้ด
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');
    const watContainer = document.querySelector('.wat');
    const dotsContainer = document.querySelector('.dots');
    // เก็บตัวแปรของ carousel (เริ่มต้นที่ 0)
    let currentIndex = 0;
    // ตัวแปรสำหรับเก็บ ID ของ setInterval เพื่อใช้หยุด Auto Play (เริ่มต้นเป็น null)
    let autoPlayInterval = null;
    // ตัวแปรเก็บสถานะของ checkbox Auto Play (true ถ้าถูกเลือก, false ถ้าไม่ถูกเลือก)
    let isAutoPlay = document.getElementById('autoplay').checked;

    // จำนวนรายการทั้งหมด (4 รายการ)
    const totalItems = items.length;

    // Clone รายการทั้งหมดเพื่อใช้ใน Infinite Loop
    for (let i = 0; i < totalItems; i++) {
        // Clone รายการที่ i (รวมถึง <a>, <img>, <p> ด้วย true)
        const clone = items[i].cloneNode(true);
        // เพิ่มรายการที่ clone ไปท้าย watContainer
        watContainer.appendChild(clone);
    }


    // ฟังก์ชันสร้าง dots ตามจำนวนรายการ
    function createDots() {
        // ล้าง dots เดิมทั้งหมดเพื่อป้องกันการสร้างซ้ำ
        dotsContainer.innerHTML = '';
        // สร้าง dots ตามจำนวนรายการจริง (เช่น 4 dots)
        for (let i = 0; i < totalItems; i++) {
            // สร้าง element <span> สำหรับ dot
            const dot = document.createElement('span');
            // เพิ่ม class dot เพื่อให้มีสไตล์ตาม CSS
            dot.classList.add('dot');
            // เพิ่ม class active ให้ dot แรกเพื่อบอกว่ารายการแรกกำลังแสดง
            if (i === 0) dot.classList.add('active');
            // เพิ่ม event listener ให้ dot เมื่อคลิก
            dot.addEventListener('click', () => {
                // อัปเดต currentIndex ให้ตรงกับ dot ที่คลิก
                currentIndex = i;
                // เรียกฟังก์ชันเพื่อเลื่อน carousel ไปยังตำแหน่งที่เลือก
                updateCarousel();
            });
            // เพิ่ม dot ไปใน dotsContainer
            dotsContainer.appendChild(dot);
        }
    }

    // ฟังก์ชันอัปเดตการเลื่อนของ carousel
    function updateCarousel() {
        const itemWidth = 300; // ความกว้างของแต่ละ item
        const gap = 20; // ช่องว่างระหว่าง item
        const itemTotalWidth = itemWidth + gap; // ความกว้างรวมของ 1 รายการ (รวมช่องว่าง)
        // คำนวณตำแหน่งที่ต้องเลื่อน (เช่น ถ้า currentIndex = 1, offset = -320px)
        const offset = -currentIndex * itemTotalWidth;
        // เลื่อน watContainer ไปทางซ้ายตามค่า offset
        watContainer.style.transform = `translateX(${offset}px)`;

        // ตรวจสอบว่าถึงรายการสุดท้ายของรายการจริงหรือไม่ (เช่น currentIndex >= 4)
        if (currentIndex >= totalItems) {
            // รอ 200ms เพื่อให้ animation เดิมเสร็จก่อนรีเซ็ตตำแหน่ง
            setTimeout(() => {
                // ปิด transition ชั่วคราวเพื่อให้การรีเซ็ตตำแหน่งไม่กระตุก
                watContainer.style.transition = 'none';
                // รีเซ็ต currentIndex กลับไปที่ 0 (กลับไปที่รายการแรก)
                currentIndex = 0;
                // คำนวณตำแหน่งใหม่ (เช่น 0 * 320 = 0px)
                const resetOffset = -currentIndex * itemTotalWidth;
                // รีเซ็ตตำแหน่งกลับไปที่จุดเริ่มต้น
                watContainer.style.transform = `translateX(${resetOffset}px)`;
                // เปิด transition ใหม่เพื่อให้การเลื่อนต่อไปราบรื่น
                watContainer.style.transition = 'transform 0.5s ease'; // เปิด transition ใหม่
            }, 200); // รอให้ animation เดิมเสร็จก่อน
        }

        // อัปเดต dots เพื่อบอกตำแหน่งปัจจุบัน
        const dots = document.querySelectorAll('.dot');
        // วนลูปผ่าน dots เพื่อเพิ่ม/ลบ class active
        dots.forEach((dot, index) => {
            // เพิ่ม class active ให้ dot ที่ตรงกับตำแหน่งปัจจุบัน (ใช้ % เพื่อวนลูป)
            dot.classList.toggle('active', index === (currentIndex % totalItems));
        });
    }

    // ฟังก์ชันสำหรับ Auto Play (เลื่อนอัตโนมัติ)
    function autoPlay() {
        // เพิ่ม currentIndex ทีละ 1 เพื่อเลื่อนไปยังรายการถัดไป
        currentIndex++;
        // เรียกฟังก์ชันเพื่ออัปเดตการเลื่อน
        updateCarousel();
    }

    // ฟังก์ชันเริ่ม Auto Play
    function startAutoPlay() {
        // ตรวจสอบว่าสถานะ Auto Play เปิดอยู่หรือไม่
        if (isAutoPlay) {
            // เรียก autoPlay ทุก 3 วินาที (3000ms) และเก็บ ID ของ setInterval
            autoPlayInterval = setInterval(autoPlay, 3000);
        }
    }

    // ฟังก์ชันหยุด Auto Play
    function stopAutoPlay() {
        // ตรวจสอบว่ามี setInterval ทำงานอยู่หรือไม่
        if (autoPlayInterval) {
            // หยุด setInterval เพื่อหยุด Auto Play
            clearInterval(autoPlayInterval);
            // รีเซ็ตตัวแปร autoPlayInterval
            autoPlayInterval = null;
        }
    }

    // ฟังก์ชันควบคุมการเปิด/ปิด Auto Play
    window.toggleAutoPlay = function () {
        // อัปเดตสถานะ isAutoPlay ตาม checkbox
        isAutoPlay = document.getElementById('autoplay').checked;
        // หยุด Auto Play ก่อน
        stopAutoPlay();
        // ถ้า Auto Play เปิดอยู่ ให้เริ่ม Auto Play
        if (isAutoPlay) {
            startAutoPlay();
        }
    };

    // เรียกฟังก์ชันเริ่มต้น
    createDots();
    updateCarousel(); // ตั้งค่าตำแหน่งเริ่มต้นของ carousel

    // เริ่ม Auto Play ถ้า checkbox ถูกเลือก
    startAutoPlay();
});