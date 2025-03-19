document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * (300 + 20); // 300px (width) + 20px (gap)
        document.querySelector('.wat').style.transform = `translateX(${offset}px)`;

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function autoPlay() {
        currentIndex = (currentIndex + 1) % Math.ceil(items.length / 3);
        updateCarousel();
    }

    // Initial setup
    updateCarousel();

    // Auto play every 3 seconds
    setInterval(autoPlay, 3000);

    // Dot click event
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
});