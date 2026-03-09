
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdEuAqxHxHaxE3lTCEOwH2YO8L2Jg4hlY",
  authDomain: "dtorder-19c91.firebaseapp.com",
  projectId: "dtorder-19c91",
  storageBucket: "dtorder-19c91.appspot.com",
  messagingSenderId: "499125096462",
  appId: "1:499125096462:web:5fc0f37019e018fd57ac5f"
};
let allProducts = [];
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
    async function loadProducts() {
    try {
        allProducts = []; 

        const snapshot = await getDocs(collection(db, "products"));

        snapshot.forEach(doc => {
        allProducts.push({
            _fid: doc.id,        
            ...doc.data()        
        });
        });

        console.log("Đã load", allProducts.length, "sản phẩm");

    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
    }
    }

async function renderRelatedProducts() {

    const currentProduct = JSON.parse(localStorage.getItem("selectedProduct"));

    console.log("selectedProduct từ localStorage:", currentProduct);

    if (!currentProduct) {
        console.error("Không tìm thấy selectedProduct trong localStorage");
        return;
    }

    const related = allProducts.filter(p =>
        p.brand?.some(b => currentProduct.brand?.includes(b)) &&
        p._fid !== currentProduct._fid
    );

    const track = document.getElementById("sliderTrack");
    if (!track) return;

    related.forEach(p => {

        const formattedPrice = Number(p.price).toLocaleString("vi-VN");

        track.innerHTML += `
            <div class="product" onclick="viewProductDetail2('${p._fid}')">
                <img src="${p.images?.[0] || ''}">
                <h3>${p.name}</h3>
                <p style="font-family:'Momo Trust Display', sans-serif">${formattedPrice}₫</p>
            </div>
        `;
    });
}
loadProducts().then(() => {
     renderRelatedProducts()
});
window.viewProductDetail2 = function (productId) {

    if (!allProducts.length) {
        console.error("Products chưa được load!");
        return;
    }

    let productDetail = allProducts.find(p => p._fid == productId);

    localStorage.setItem("selectedProduct", JSON.stringify(productDetail));

    window.location.href = "product_detail.html";
}
