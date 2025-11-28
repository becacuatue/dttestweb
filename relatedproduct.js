let allProducts = []
async function loadProducts() {
    const res = await fetch('product_list.json');
    allProducts = await res.json();
}

async function renderRelatedProducts() {
    const currentProduct = JSON.parse(localStorage.getItem("selectedProduct"));

    if (!currentProduct) return;
    const related = allProducts.filter(p =>
        p.brand === currentProduct.brand && p.id !== currentProduct.id
    );
    const track = document.getElementById("sliderTrack");
    related.forEach(p => {
        track.innerHTML += `
                <div class="product-card" onclick="viewProductDetail2(${p.id})">
                    <img src="${p.img}">
                    <h3>${p.name}</h3>
                    <p style="font-family: "Momo Trust Display", sans-serif">${formattedPrice}₫</p>
                </div>
                `;
    });
    let position = 0;
    setInterval(() => {
        position -= 300;
        if (Math.abs(position) >= track.scrollWidth - 100) {
            position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
    }, 1000);
}
loadProducts().then(() => {
     renderRelatedProducts()
});
function viewProductDetail2(productId) {
    if (!allProducts.length) {
        console.error("Products chưa được load!");
        return;
    }

    let productDetail = allProducts.find(p => p.id == productId);
    localStorage.setItem("selectedProduct", JSON.stringify(productDetail));
    window.location.href="product_detail.html";
}
