function animateOnScroll() {
    const elems = document.querySelectorAll('.animate-about');
    const trigger = window.innerHeight * 0.85;

    elems.forEach(el => {
        const top = el.getBoundingClientRect().top;

        if (top < trigger) {
            el.classList.add('show-about');
        } else {
            el.classList.remove('show-about'); 
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
