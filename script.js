 // ============================
    // DATA SẢN PHẨM
    // ============================
let products = []; // array bên ngoài


async function loadProducts() {
    try {
        const res = await fetch('product_list.json');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        products = data; // Gán dữ liệu vào biến toàn cục
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
}

// ----------------------------------------------------
// KHAI BÁO BIẾN DOM (Có thể giữ ở đây vì không cần dữ liệu)
// ----------------------------------------------------
const tagBar = document.getElementById("tagBar");
const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const noResult = document.getElementById("noResult");
const pagination = document.getElementById("pagination");
const productStar = document.getElementById("productStar")

let allTags = []; // KHỞI TẠO BẰNG MẢNG RỖNG
let activeTag = null;
let currentPage = 1;
const perPage = 48;

// ============================
// LOGIC CHÍNH CỦA CHƯƠNG TRÌNH
// (GIỮ NGUYÊN - VÌ NÓ DÙNG BIẾN TOÀN CỤC)
// ============================

function renderTags() {
    tagBar.innerHTML = `
        <button class="tag-btn ${activeTag === null ? "active" : ""}" onclick="selectTag(null)">
            Tất cả
        </button>
    `;

    allTags.forEach(tag => { // allTags đã được cập nhật sau khi fetch
        tagBar.innerHTML += `
            <button class="tag-btn ${activeTag === tag ? "active" : ""}" onclick="selectTag('${tag}')">
                #${tag}
            </button>
        `;
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
    
    // Dữ liệu 'products' đã được gán và sử dụng ở đây
    return products.filter(p =>
        (activeTag ? p.tags.includes(activeTag) : true) &&
        (keyword ? p.name.toLowerCase().includes(keyword) : true)
    );
}

    // ============================
    // FETCH FILTERED PRODUCTS
    // ============================
    function getFilteredProducts() {
        const keyword = searchInput.value.toLowerCase();

        return products.filter(p =>
            (activeTag ? p.tags.includes(activeTag) : true) &&
            (keyword ? p.name.toLowerCase().includes(keyword) : true)
        );
    }

    // ============================
    // RENDER PRODUCTS + PAGINATION
    // ============================
    function renderProducts() {
        let filtered = getFilteredProducts();
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

    // ============================
    // PAGINATION RENDER
    // ============================
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

    searchInput.addEventListener("input", () => {
        currentPage = 1;
        renderProducts();
    });

loadProducts().then(() => {
    // 1. Cập nhật allTags từ dữ liệu mới tải về
    allTags = [...new Set(products.flatMap(p => p.tags))];

    console.log("Dữ liệu đã tải xong:", products.length, "sản phẩm.");
    console.log("Danh sách Tags:", allTags);

    // 2. Chạy các hàm khởi tạo giao diện
    renderTags();
    renderProducts();
});
function viewProductDetail(productId) {
    const productDetail = products.find(p => p.id == productId);
    const productInfoOut = JSON.stringify(productDetail);
    localStorage.setItem('selectedProduct',productInfoOut)
    window.location.href="product_detail.html";
}
