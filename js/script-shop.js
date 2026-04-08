document.addEventListener("DOMContentLoaded", function() {
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterPanel = document.querySelector('.filter-panel');
    if (filterToggleBtn && filterPanel) {
        filterToggleBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('active');
            filterToggleBtn.classList.toggle('active');
        });
    }

    const filterHeaders = document.querySelectorAll('.filter-group h3');
    filterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.filter-group');
            group.classList.toggle('active');
        });
    });

    const priceRange = document.querySelector('.price-range');
    if (priceRange) {
        const minSlider = document.getElementById('price-min');
        const maxSlider = document.getElementById('price-max');
        const minValue = document.getElementById('min-value');
        const maxValue = document.getElementById('max-value');
        const sliderFill = priceRange.querySelector('.slider-fill');

        function updateSlider() {
            let minVal = parseInt(minSlider.value);
            let maxVal = parseInt(maxSlider.value);

            if (minVal > maxVal) {
                minVal = maxVal;
                minSlider.value = minVal;
            }

            minValue.textContent = minVal;
            maxValue.textContent = maxVal;

            const percentMin = (minVal / 1000) * 100;
            const percentWidth = ((maxVal - minVal) / 1000) * 100;
            sliderFill.style.left = percentMin + '%';
            sliderFill.style.width = percentWidth + '%';
        }

        minSlider.addEventListener('input', updateSlider);
        maxSlider.addEventListener('input', updateSlider);
        updateSlider(); 
    }
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const activeSpan = document.querySelector('.shop-bg .active');
    const resetBtn = document.getElementById('reset-filters');

    activeSpan.textContent = '';

    categoryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                activeSpan.textContent = this.value;
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            categoryRadios.forEach(radio => radio.checked = false);
            activeSpan.textContent = ''; 
        });
    }
});

//BACK-END
let products = [];
let currentPage = 1;
const itemsPerPage = 15;

let activeCategory = null;
let activeMinPrice = 0;
let activeMaxPrice = 1000;
let activeRatings = [];
let activeTags = [];

const productsList = document.querySelector('.products-list');
const pagination = document.querySelector('.pagination .page-numbers');

fetch('json/products.json')
    .then(res => res.json())
    .then(data => {
        products = data;
        setupFilters();
        renderPage(currentPage);
        renderPagination();
        renderSaleProducts();
    });

function setupFilters() {
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener('change', () => {
            const checkedInput = document.querySelector('input[name="category"]:checked');
            activeCategory = checkedInput ? checkedInput.value : null;
            currentPage = 1;
            renderPage(currentPage);
            renderPagination();
        });
    });

    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');

    function updatePrice() {
        activeMinPrice = parseFloat(priceMinInput.value);
        activeMaxPrice = parseFloat(priceMaxInput.value);
        currentPage = 1;
        renderPage(currentPage);
        renderPagination();
        document.getElementById('min-value').textContent = activeMinPrice;
        document.getElementById('max-value').textContent = activeMaxPrice;
    }

    priceMinInput.addEventListener('input', updatePrice);
    priceMaxInput.addEventListener('input', updatePrice);

    document.querySelectorAll('input[name="rating"]').forEach(input => {
        input.addEventListener('change', () => {
            activeRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(el => parseInt(el.value));
            currentPage = 1;
            renderPage(currentPage);
            renderPagination();
        });
    });

    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            activeTags = Array.from(document.querySelectorAll('.tag-btn.active')).map(el => el.textContent.trim());
            currentPage = 1;
            renderPage(currentPage);
            renderPagination();
        });
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        activeCategory = null;
        activeMinPrice = 0;
        activeMaxPrice = 1000;
        activeRatings = [];
        activeTags = [];

        document.querySelectorAll('input[name="category"]').forEach(input => input.checked = false);
        document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('price-min').value = 0;
        document.getElementById('price-max').value = 1000;
        document.getElementById('min-value').textContent = 0;
        document.getElementById('max-value').textContent = 1000;

        currentPage = 1;
        renderPage(currentPage);
        renderPagination();
    });
}

function safeText(text, max = 100) {
    if (!text || typeof text !== "string") return "";
    text = text.replace(/<\/?[^>]+>/g, "");
    return text.length > max ? text.slice(0, max) + "…" : text;
}

function safeImg(src) {
    return src && typeof src === "string" ? src : "img/default.jpg";
}

function renderSaleProducts() {
    const saleContainer = document.querySelector('.sale-products-list');
    saleContainer.innerHTML = '';
    const saleProducts = products.filter(product => product.sale);
    const limitedSaleProducts = saleProducts.slice(0, 3);

    limitedSaleProducts.forEach(product => {
        const saleCard = document.createElement('div');
        saleCard.className = 'sale-products-card';
        saleCard.innerHTML = `
            <img src="${safeImg(product.image)}" alt="${safeText(product.name, 60)}">
            <div class="sale-products-card-content">
                <p>${safeText(product.name, 80)}</p>
                <span>$${product.oldPrice ? product.oldPrice.toFixed(2) : product.price.toFixed(2)} <b>$${product.price.toFixed(2)}</b></span>
                <div class="rating">${renderStars(product.rating)}</div>
            </div>
        `;

        saleCard.addEventListener('click', () => {
            window.location.href = `product-details.html?id=${product.id}`;
        });

        saleContainer.appendChild(saleCard);
    });
}

function renderPage(page) {
    productsList.innerHTML = '';
    const filtered = products.filter(product => {
        const categoryMatch = !activeCategory || product.category === activeCategory;
        const priceMatch = product.price >= activeMinPrice && product.price <= activeMaxPrice;
        const ratingMatch = activeRatings.length === 0 || activeRatings.some(r => product.rating >= r);
        const tagsMatch = activeTags.length === 0 || activeTags.every(tag => product.tags.includes(tag));

        return categoryMatch && priceMatch && ratingMatch && tagsMatch;
    });

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up' + (product.sale ? ' sale' : '');
        card.innerHTML = `
            <img src="${safeImg(product.image)}" alt="${safeText(product.name, 60)}">
            <span class="name-product">${safeText(product.name, 80)}</span>
            <span class="price">$${product.price.toFixed(2)}${product.oldPrice ? ` <s>$${product.oldPrice.toFixed(2)}</s>` : ''}</span>
            <div class="rating">
                ${renderStars(product.rating)}
            </div>
            <div class="add-to-cart">
                <svg class="default" width="50" height="50">
                    <use xlink:href="img/sprite.svg#add-to-cart-alt"></use>
                </svg>
                <svg class="hover" width="50" height="50">
                    <use xlink:href="img/sprite.svg#add-to-cart"></use>
                </svg>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `product-details.html?id=${product.id}`;
        });

        productsList.appendChild(card);
    });
    setTimeout(() => animateBlocks(".product-card", "fade-in-up"), 50);
}

function renderStars(rating) {
    const starPath = `<path d="M5.08172 7.81542L7.4461 9.31317C7.74835 9.50442 8.12335 9.21979 8.03372 8.86692L7.35085 6.18004C7.33156 6.1052 7.33378 6.02643 7.35727 5.9528C7.38075 5.87916 7.42454 5.81365 7.4836 5.76379L9.60385 3.99942C9.8821 3.76767 9.73885 3.30529 9.38072 3.28204L6.6121 3.10204C6.53755 3.09675 6.46605 3.0704 6.4059 3.02606C6.34575 2.98171 6.29944 2.92119 6.27235 2.85154L5.2396 0.251293C5.21148 0.177395 5.16156 0.11379 5.09646 0.0689113C5.03136 0.0240326 4.95416 0 4.8751 0C4.79603 0 4.71883 0.0240326 4.65373 0.0689113C4.58864 0.11379 4.53872 0.177395 4.5106 0.251293L3.47785 2.85154C3.45081 2.92126 3.40452 2.98186 3.34437 3.02627C3.28422 3.07069 3.21268 3.0971 3.1381 3.10242L0.369473 3.28242C0.0117229 3.30529 -0.132277 3.76767 0.146348 3.99942L2.2666 5.76417C2.32559 5.81399 2.36934 5.87944 2.39282 5.953C2.4163 6.02656 2.41856 6.10525 2.39935 6.18004L1.76635 8.67192C1.65872 9.09529 2.1091 9.43692 2.47135 9.20704L4.66885 7.81542C4.73061 7.77615 4.80228 7.7553 4.87547 7.7553C4.94866 7.7553 5.02033 7.77615 5.0821 7.81542H5.08172Z" />`;

    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<svg width="20" height="20" ${i <= rating ? 'class="filled"' : ''} viewBox="0 0 10 10" fill="currentColor">
            ${starPath}
        </svg>`;
    }
    return stars;
}

function renderPagination() {
    const filtered = products.filter(product => {
        const categoryMatch = !activeCategory || product.category === activeCategory;
        const priceMatch = product.price >= activeMinPrice && product.price <= activeMaxPrice;
        const ratingMatch = activeRatings.length === 0 || activeRatings.some(r => product.rating >= r);
        const tagsMatch = activeTags.length === 0 || activeTags.every(tag => product.tags.includes(tag));
        return categoryMatch && priceMatch && ratingMatch && tagsMatch;
    });

    const pageCount = Math.ceil(filtered.length / itemsPerPage);
    pagination.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentPage);
            renderPagination();
        });
        pagination.appendChild(pageBtn);
    }
}

document.querySelector('.prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        renderPagination();
    }
});

document.querySelector('.next').addEventListener('click', () => {
    const filtered = products.filter(product => {
        const categoryMatch = !activeCategory || product.category === activeCategory;
        const priceMatch = product.price >= activeMinPrice && product.price <= activeMaxPrice;
        const ratingMatch = activeRatings.length === 0 || activeRatings.some(r => product.rating >= r);
        const tagsMatch = activeTags.length === 0 || activeTags.every(tag => product.tags.includes(tag));
        return categoryMatch && priceMatch && ratingMatch && tagsMatch;
    });
    const pageCount = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage < pageCount) {
        currentPage++;
        renderPage(currentPage);
        renderPagination();
    }
});


