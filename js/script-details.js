const tabButtons = document.querySelectorAll('.pd-tab');
const tabContents = document.querySelectorAll('.pd-tab-content');

tabButtons[0].classList.add('active');
tabContents[0].classList.add('active');

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        tabContents[index].classList.add('active');
    });
});

//BACK-END
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));

const pdThumbs = document.querySelector('.pd-thumbs');
const pdMainImg = document.querySelector('.pd-main-img');
const pdTitle = document.querySelector('.pd-title');
const pdStock = pdTitle.querySelector('.pd-stock');
const pdPriceOld = document.querySelector('.pd-price .old');
const pdPriceNew = document.querySelector('.pd-price .new');
const pdBrand = document.querySelector('.pd-brand b');
const pdDesc = document.querySelector('.pd-desc');
const pdCategory = document.querySelector('.pd-meta li b');
const pdTags = document.querySelector('.pd-meta li:nth-child(2)');
const pdTabContents = document.querySelectorAll('.pd-tab-content');
const pdAdditionalInfo = document.querySelector('.pd-additional-info');
const pdRelatedGrid = document.querySelector('.pd-related-grid');
fetch('json/products.json')
  .then(res => res.json())
  .then(productsData => {
    allProducts = productsData;

    fetch('json/product-details.json')
    .then(res => res.json())
    .then(data => {
        const product = data.find(p => p.id === productId);
        if (!product) {
            document.body.innerHTML = '<h2 style="text-align:center; color:red; margin-top: 50px;">Продукт не знайдено</h2>';
            return;
        }
        const breadcrumbItems = document.querySelectorAll('.shop-bg span');
        breadcrumbItems[4].textContent = product.category; 
        breadcrumbItems[6].textContent = product.name;

        pdThumbs.innerHTML = '';
        product.images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.alt = `${product.name} ${index + 1}`;
        thumb.className = 'pd-thumb' + (index === 0 ? ' active' : '');
        pdThumbs.appendChild(thumb);

        thumb.addEventListener('click', () => {
            document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            pdMainImg.src = img;
        });
        });

        pdMainImg.src = product.images[0];

        pdTitle.firstChild.textContent = product.name + ' ';
        pdStock.textContent = product.stock;
        pdStock.className = 'pd-stock ' + (product.stock === 'В НАЯВНОСТІ' ? 'in' : 'out');
        pdPriceOld.textContent = product.oldPrice ? `$${product.oldPrice.toFixed(2)}` : '';
        pdPriceNew.textContent = `$${product.price.toFixed(2)}`;
        pdBrand.textContent = product.brand;
        pdDesc.textContent = product.description;
        pdCategory.textContent = product.category;
        pdTags.innerHTML = '<b>Теги:</b> ' + product.tags.join(', ');

        pdTabContents[0].innerHTML = `<p>${product.description}</p><ul class="pd-list">${product.features.map(f => `<li>${f}</li>`).join('')}</ul>`;

        pdAdditionalInfo.innerHTML = product.additionalInfo.map(info => `<li><b>${info.key}:</b> ${info.value}</li>`).join('');
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
        pdRelatedGrid.innerHTML = '';
        const relatedProducts = allProducts.filter(p => product.related && product.related.includes(p.id));
        relatedProducts.forEach(rp => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in' + (rp.oldPrice && rp.oldPrice > rp.price ? ' sale' : '');
            card.innerHTML = `
                <img src="${rp.image}" alt="${rp.name}">
                <span class="name-product">${rp.name}</span>
                <span class="price">$${rp.price.toFixed(2)}${rp.oldPrice ? ` <s>$${rp.oldPrice.toFixed(2)}</s>` : ''}</span>
                <div class="rating">${renderStars(rp.rating)}</div>
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
                window.location.href = `product-details.html?id=${rp.id}`;
            });
            pdRelatedGrid.appendChild(card);
        });
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error('Products data error:', err));


