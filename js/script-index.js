const categoriesBtn = document.querySelector('.categories');
const categoriesDropdown = document.querySelector('.categories-dropdown');

if (categoriesBtn && categoriesDropdown) {
    categoriesBtn.addEventListener('click', () => {
        categoriesDropdown.classList.toggle('active');
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".modal-window");
  const closeBtn = document.querySelector(".close-btn");
  const doNotShow = document.querySelector(".do-not-show input");
  if (!localStorage.getItem("doNotShowModal")) {
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
  }

  function closeModal() {
    modal.style.display = "none";
    if (doNotShow.checked) {
      localStorage.setItem("doNotShowModal", "true");
    }
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  const timerBoxes = document.querySelectorAll(".timer-box .time");
  
  if (timerBoxes.length > 0 && typeof countdown === 'function') {
    const endDate = new Date("2025-11-25T23:59:59");

    function updateTimer() {
      const now = new Date();
      const timeLeft = countdown(now, endDate);

      timerBoxes[0].textContent = String(timeLeft.days).padStart(2, "0");
      timerBoxes[1].textContent = String(timeLeft.hours).padStart(2, "0");
      timerBoxes[2].textContent = String(timeLeft.minutes).padStart(2, "0");
      timerBoxes[3].textContent = String(timeLeft.seconds).padStart(2, "0");
    }

    setInterval(updateTimer, 1000);
    updateTimer();
  }
});


const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dots .dot');
const prevBtn = document.querySelector('.hero-arrow.left');
const nextBtn = document.querySelector('.hero-arrow.right');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        dots[i].classList.toggle('active', i === index);
    });
}

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentSlide = i;
        showSlide(currentSlide);
    });
});
