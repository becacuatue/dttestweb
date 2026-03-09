
const product = JSON.parse(localStorage.getItem('selectedProduct'));
console.log(product);
let slideIndex = 0;
let index = 0;
let detailImg2 = product.images[1];
let detailImg3 = product.images[2];
let detailImg4 = product.images[3];
let detailImg5 = product.images[4];
let size = [];
size = product.size;
size.forEach(sizes => {
  const newop = document.createElement("option");
  newop.textContent = sizes;
  document.getElementById('size').append(newop);
})
const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        document.getElementById('productDes').innerText = product.des;
        document.getElementById('productTag').innerText = product.tags;
        document.getElementById('productName').innerText = product.brand + ': ' + product.name; 
        document.getElementById('productPrice').innerText = formattedPrice + '₫';
        document.getElementById('productImage').src = product.images[0];
        document.getElementById('detailImg2').src = detailImg2;   
        document.getElementById('detailImg3').src = detailImg3;  
        document.getElementById('detailImg4').src = detailImg4;  
        document.getElementById('detailImg5').src = detailImg5;
function showSlide(slideIndex){
  console.log(product.images[slideIndex]);
  document.getElementById('productImage').src = product.images[slideIndex];
}
function next(){
  index++;
  slideIndex = index - ((product.images).length)*(Math.floor(index/((product.images).length))); 
  showSlide(slideIndex)
  console.log(index);
}
function prev(){
  index -- ;
  if(index >= 0){
    slideIndex = index - ((product.images).length)*(Math.floor(index/((product.images).length)));
    showSlide(slideIndex);
  }if (index < 0){
    index=0;
    slideIndex = index;
    showSlide(slideIndex);
  }
   console.log(index);
}
/**=================================================================================addtocart======================== */
function addToCart() {
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!selectedProduct) {
        alert("Không tìm thấy thông tin sản phẩm!");
        return;
    }

    // Lấy size
    const sizeSelect = document.querySelectorAll(".button")[0];
    const selectedSize = sizeSelect.value;

    if (selectedSize === "Chọn Size") {
        alert("Vui lòng chọn size!");
        return;
    }
    const quantitySelect = document.querySelectorAll(".button")[1];
    let quantity = quantitySelect.value === "Số Lượng" ? 1 : parseInt(quantitySelect.value);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existed = cart.find(
        item => item.id === selectedProduct.id && item.size === selectedSize
    );

    if (existed) {
        existed.quantity += quantity;
    } else {
        cart.push({
            id: selectedProduct.id,
            brand: selectedProduct.brand,
            name: selectedProduct.name,
            img: selectedProduct.images[0],
            price: selectedProduct.price,
            size: selectedSize,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
}
