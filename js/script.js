const burger = document.querySelector(".burger-menu");
const openIcon = document.getElementById("openIcon");
const closeIcon = document.getElementById("closeIcon");
const navBar = document.querySelector(".nav-bar");

burger.addEventListener("click", () => {
  navBar.classList.toggle("active");
  openIcon.style.display = navBar.classList.contains("active")
    ? "none"
    : "inline-block";
  closeIcon.style.display = navBar.classList.contains("active")
    ? "inline-block"
    : "none";
});

const animateBlocks = (selector, animationClass) => {
  const blocks = document.querySelectorAll(selector);

  const checkVisibility = () => {
    const windowHeight = window.innerHeight;

    blocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      const visiblePart = rect.top < windowHeight * 0.93 && rect.bottom > windowHeight * 0.2;

      if (visiblePart) {
        block.classList.add(animationClass);
      } else {
        block.classList.remove(animationClass);
      }
    });
  };

  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('resize', checkVisibility);
  checkVisibility();
};

animateBlocks(".product-card", "fade-in-up");
animateBlocks(".testimonial-card", "scale-in");
animateBlocks(".blog-card", "fade-in-left");

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});

document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash-screen");
    const visited = localStorage.getItem("visited");

    if (!visited) {
        setTimeout(() => {
            splash.classList.add("hidden");
        }, 1500);
        localStorage.setItem("visited", "true");

    } else {
        splash.classList.add("hidden");
    }
});

fetch("cart.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("cart-modal-container").innerHTML = html;
        const cartModal = document.querySelector(".cart-modal");
        const cartOverlay = document.querySelector(".cart-modal-overlay");
        const cartClose = document.querySelector(".cart-close");
        const cartBtn = document.querySelector(".header-cart-btn"); 
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                cartModal.classList.add("active");
                cartOverlay.classList.add("active");
            });
        }

        cartClose.addEventListener("click", () => {
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
        });

        cartOverlay.addEventListener("click", () => {
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
        });
    });

const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

