document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.getElementById('filterToggle');
    const sidebarContent = document.getElementById('sidebarContent');

    if (filterToggle && sidebarContent) {
        filterToggle.addEventListener('click', function() {
            filterToggle.classList.toggle('active');
            sidebarContent.classList.toggle('active');
        });
    }
});

  function safeText(val, max = 120) {
      if (!val || typeof val !== "string") return "";
      val = val.replace(/<\/?[^>]+>/g, "");
      return val.length > max ? val.slice(0, max) + "…" : val;
  }

  function safeImg(src) {
      return (src && typeof src === "string") ? src : "img/default.jpg";
  }

document.addEventListener("DOMContentLoaded", () => {
  const blogList = document.querySelector(".blog-list");
  const prevBtn = document.querySelector(".pagination .prev");
  const nextBtn = document.querySelector(".pagination .next");
  const pageNumbersContainer = document.querySelector(".pagination .page-numbers");

  const searchInput = document.querySelector(".sidebar-search input");
  const categoryLinks = document.querySelectorAll(".categories-list a");

  let blogs = [];
  let filteredBlogs = [];
  const blogsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;

  let selectedCategory = null;
  let searchTerm = "";

  function applyFilters() {
    filteredBlogs = blogs.filter(blog => {
      const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    currentPage = 1;
    renderBlogs();
  }

  function renderBlogs(page = 1) {
    blogList.innerHTML = "";

    const start = (page - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    const blogsToShow = filteredBlogs.slice(start, end);

    blogsToShow.forEach(blog => {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <div class="blog-content">
          <div class="blog-img">
            <img src="${safeImg(blog.image)}" alt="${safeText(blog.title, 60)}">
            <div class="date">
              <span>${new Date(blog.date).getDate()}</span>
              <small>${new Date(blog.date).toLocaleString('uk-UA', { month: 'short' })}</small>
            </div>
          </div>
          <div class="blog-meta">
            <div class="blog-meta-item">
              <svg><use xlink:href="img/sprite.svg#tag-icon"></use></svg>
              <span>${safeText(blog.category, 30)}</span>
            </div>
            <div class="blog-meta-item">
              <svg><use xlink:href="img/sprite.svg#user-icon"></use></svg>
              <span>Автор: ${safeText(blog.author, 40)}</span>
            </div>
            <div class="blog-meta-item">
              <svg><use xlink:href="img/sprite.svg#comment-icon"></use></svg>
              <span>${blog.comments} Коментарів</span>
            </div>
          </div>
          <h3>${safeText(blog.title, 90)}</h3>
          <a href="${blog.link}" class="read-more">Читати далі →</a>
        </div>
      `;
      blogList.appendChild(card);
        setTimeout(() => animateBlocks(".blog-card", "fade-in-left"), 50);
    });

    updatePagination();
    
  }

  function updatePagination() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageNumbersContainer.innerHTML = "";
    for(let i = 1; i <= totalPages; i++) {
      const pageEl = document.createElement(i === currentPage ? "span" : "a");
      pageEl.textContent = i;
      if(i !== currentPage) {
        pageEl.href = "#";
        pageEl.addEventListener("click", e => {
          e.preventDefault();
          currentPage = i;
          renderBlogs(currentPage);
        });
      } else {
        pageEl.className = "active";
      }
      pageNumbersContainer.appendChild(pageEl);
    }
  }

  prevBtn.addEventListener("click", () => {
    if(currentPage > 1) {
      currentPage--;
      renderBlogs(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if(currentPage < totalPages) {
      currentPage++;
      renderBlogs(currentPage);
    }
  });

  searchInput.addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    applyFilters();
  });

  categoryLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      if(selectedCategory === link.textContent) {
        selectedCategory = null;
      } else {
        selectedCategory = link.textContent;
      }
      categoryLinks.forEach(l => l.classList.remove("active"));
      if(selectedCategory) link.classList.add("active");

      applyFilters();
    });
  });

  fetch('json/blog.json')
    .then(res => res.json())
    .then(data => {
      blogs = data;
      filteredBlogs = [...blogs];
      totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
      renderBlogs(currentPage);
    })
    .catch(err => {
      blogList.innerHTML = "<p>Помилка завантаження блогів.</p>";
      console.error(err);
    });
});