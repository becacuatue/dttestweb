import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdEuAqxHxHaxE3lTCEOwH2YO8L2Jg4hlY",
  authDomain: "dtorder-19c91.firebaseapp.com",
  projectId: "dtorder-19c91",
  storageBucket: "dtorder-19c91.appspot.com",
  messagingSenderId: "499125096462",
  appId: "1:499125096462:web:5fc0f37019e018fd57ac5f"
};

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    let products = [];
    let selectedValue = null;
    async function loadProducts() {
    const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
        products.push({
        _fid: doc.id,
        ...doc.data()
        });
    });

    console.log(products);
    }



    const tagBar = document.getElementById("tagBar");
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("search");
    const noResult = document.getElementById("noResult");
    const pagination = document.getElementById("pagination");

    let allTags = [];
    let activeTag = null;
    let currentPage = 1;
    const perPage = 36;
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
        const allBrands = products.flatMap(p =>
            Array.isArray(p.brand) ? p.brand : [p.brand]
        );

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
    window.selectTag = function (tag) {
        activeTag = tag == activeTag ? null : tag;
        currentPage = 1;
        renderTags();
        renderProducts();
    };


    function getFilteredProducts() {
        const keyword = searchInput.value.trim().toLowerCase();

        return products.filter(p =>
            (activeTag ? p.tags?.includes(activeTag) : true) &&
            (keyword ? p.name?.toLowerCase().includes(keyword) : true) &&
            (
                selectedValue
                    ? Array.isArray(p.brand)
                        ? p.brand.includes(selectedValue)
                        : p.brand === selectedValue
                    : true
            )
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
                    <img src="${p.images[0]}">
                    <p style="font-style: italic;font-size: 60%;"><b>tags:</b> #${p.tags.join(", ")}</p>
                    <p style="font-style: italic;font-size: 60%;"><b>brand: </b>${p.brand}${p.id}</p>
                    <h3>${p.name}</h3>
                    <p style="font-family: "Momo Trust Display", sans-serif">${formattedPrice}₫</p>
                    </div>
                `;
        });

        renderPagination(totalPages);
    }
    function renderPagination(totalPages) {
        pagination.innerHTML = "";
        let initPage = 4 + 4*(Math.floor(currentPage/4));
        if (initPage > totalPages){
            initPage = totalPages;
        }
        if (currentPage <4){
            for (let i = 1 ; i <= initPage; i++) {
                pagination.innerHTML += `
                    <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">
                        ${i}
                    </button>
                `;
            }
        } else{if(currentPage >= 4 && currentPage < totalPages){
                console.log(initPage);
                for (let i = initPage - 5 ; i <= initPage; i++) {
                    pagination.innerHTML += `
                        <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">
                            ${i}
                        </button>
                    `;
                }
            }if(currentPage == totalPages ){
                for (let i = totalPages -5 ; i <= totalPages; i++) {
                    pagination.innerHTML += `
                        <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">
                            ${i}
                        </button>
                    `;
                }
            }
        }
    }

    window.goPage = function (page) {
        currentPage = page;
        renderProducts();
    };


    document.addEventListener("DOMContentLoaded", () => {
        const brandSelectElement = document.getElementById("brand");
        const searchInput = document.getElementById("searchInput");

        if (brandSelectElement) {
            brandSelectElement.addEventListener("change", () => {
                selectedValue = brandSelectElement.value;
                currentPage = 1;
                renderProducts();
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                currentPage = 1;
                renderProducts();
            });
        }
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
    window.viewProductDetail = function (productId) {
        console.log("view product", productId);

        let productDetail = products.find(p => p.id == productId);
        localStorage.setItem(
            'selectedProduct',
            JSON.stringify(productDetail)
        );

        window.location.href = "product_detail.html";
    };


