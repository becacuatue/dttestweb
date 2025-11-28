function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cartContainer");

    if (cart.length === 0) {
        container.innerHTML = `<div class="empty">Giỏ hàng trống.</div>`;
        document.getElementById("cartTotal").innerText = "0";
        return;
    }

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    container.innerHTML += `
        <div class="cart-item">
            <img src="${item.img}" alt="img">
            <div class="cart-item-des">
                <div class="item-info">
                <div class="item-name">${item.name}</div>
                    <div class="item-size">Size: ${item.size}</div>
                    <div class="price">${item.price.toLocaleString("vi-VN")} VNĐ</div>
                    <div style="font-style: italic; font-size:40%">#id:${item.id} #brand:${item.brand}</div>
                </div>
                <div class="quantity-box">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <div>${item.quantity}</div>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Xoá</button>
            </div>
         </div>
        `;
    });
    document.getElementById("cartTotal").innerText =
      total.toLocaleString("vi-VN");
}

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) cart[index].quantity = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}
renderCart();

//POP UP CONTACT
const openBtn = document.getElementById("openContact");
const popup = document.getElementById("contactPopup");
const closeBtn = document.getElementById("closePopup");
openBtn.addEventListener("click", () => {
    popup.style.display = "flex";
});
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});
popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
});


