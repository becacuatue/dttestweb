    let products = [];
    let selectedValue = null;
    async function loadProducts() {
        try {
            const res = await fetch('product_list.json');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            products = data;
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    }

    const tagBar = document.getElementById("tagBar");
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("search");
    const noResult = document.getElementById("noResult");
    const pagination = document.getElementById("pagination");
    const productStar = document.getElementById("productStar")

    let allTags = [];
    let activeTag = null;
    let currentPage = 1;
    const perPage = 48;
    function renderTags() {
        tagBar.innerHTML = `
            <button class="tag-btn ${activeTag === null ? "active" : ""}" onclick="selectTag(null)">
                Tất cả
            </button>
        `;

        allTags.forEach(tag => {
            tagBar.innerHTML += `
                <button class="tag-btn ${activeTag === tag ? "active" : ""}" onclick="selectTag('${tag}')">
                    ${tag}
                </button>
            `;
        });
    }
    function brandInput(){
        const allBrands = products.map(p => p.brand);
        return [...new Set(allBrands)];
    }
    function renderBrand(){
        const selectElement = document.getElementById('brand');
        const brands = brandInput(); 
        brands.forEach(brandName => {
            const optionElement = document.createElement('option');
            optionElement.value = brandName;
            optionElement.textContent = brandName; 
            selectElement.appendChild(optionElement);
        });
    }
    function selectTag(tag) {
        activeTag = tag === activeTag ? null : tag;
        currentPage = 1;
        renderTags();
        renderProducts();
    }

    function getFilteredProducts() {
        const keyword = searchInput.value.toLowerCase();
        return products.filter(p =>
            (activeTag ? p.tags.includes(activeTag) : true) &&
            (keyword ? p.name.toLowerCase().includes(keyword) : true) &&
            (selectedValue ? p.brand === selectedValue : true)
        );
    }
    function renderProducts() {
        let filtered = getFilteredProducts();
        console.log(filtered);
        productList.innerHTML = "";

        if (filtered.length === 0) {
            noResult.style.display = "block";
            pagination.innerHTML = "";
            return;
        } else {
            noResult.style.display = "none";
        }

        let totalPages = Math.ceil(filtered.length / perPage);

        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        const pageItems = filtered.slice(start, end);
        pageItems.forEach(p => {
            const formattedPrice = Number(p.price).toLocaleString('vi-VN');
            productList.innerHTML += `
                <div class="product" onclick="viewProductDetail(${p.id})">
                    <img src="${p.img}">
                    <p style="font-style: italic;font-size: 60%;"><b>tags:</b> #${p.tags.join(", ")}</p>
                    <p style="font-style: italic;font-size: 60%;"><b>brand: </b>${p.brand}</p>
                    <h3>${p.name}</h3>
                    <p style="font-family: "Momo Trust Display", sans-serif">${formattedPrice}₫</p>
                    </div>
                `;
        });

        renderPagination(totalPages);
    }
    function renderPagination(totalPages) {
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
                <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">
                    ${i}
                </button>
            `;
        }
    }

    function goPage(page) {
        currentPage = page;
        renderProducts();
    }


    const brandSelectElement = document.getElementById("brand");
    brandSelectElement.addEventListener('change',()=>{
        selectedValue = brandSelectElement.value; 
        currentPage = 1;
        renderProducts(); 
    });
    

    searchInput.addEventListener("input", () => {
        currentPage = 1;
        renderProducts();
    });

    loadProducts().then(() => {
        allTags = [...new Set(products.flatMap(p => p.tags))];
        console.log("Dữ liệu đã tải xong:", products.length, "sản phẩm.");
        console.log("Danh sách Tags:", allTags);
        console.log("Danh sách Tags:", brandInput());
        brandInput();
        renderBrand();
        renderTags();
        renderProducts();
    });
    function viewProductDetail(productId) {
        const productDetail = products.find(p => p.id == productId);
        const productInfoOut = JSON.stringify(productDetail);
        localStorage.setItem('selectedProduct',productInfoOut)
        window.location.href="product_detail.html";
    }

