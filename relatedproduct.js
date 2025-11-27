async function loadProducts() {
    const res = await fetch('product_list.json');
    return await res.json();
}

async function renderRelatedProducts() {
    const allProducts = await loadProducts();
    const currentProduct = JSON.parse(localStorage.getItem("selectedProduct"));

    if (!currentProduct) return;

    // LỌC sản phẩm liên quan
    const related = allProducts.filter(p =>
        p.brand === currentProduct.brand && p.id !== currentProduct.id
    );

    const track = document.getElementById("sliderTrack");

    // Render slider item
    related.forEach(p => {
        track.innerHTML += `
            <div class="product-card">
                <img src="${p.img}">
                <h4>${p.name}</h4>
            </div>
        `;
    });

    // AUTO SLIDE
    let position = 0;
    setInterval(() => {
        position -= 300; // khoảng cách mỗi lần dịch
        if (Math.abs(position) >= track.scrollWidth - 100) {
            position = 0; // quay lại đầu
        }
        track.style.transform = `translateX(${position}px)`;
    }, 1000); // 2.5s chuyển 1 lần
}

renderRelatedProducts();
