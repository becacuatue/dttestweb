
const product = JSON.parse(localStorage.getItem('selectedProduct'));
console.log(product)
let mainImg= product.img ;
let detailImg2 = product.img2;
let detailImg3 = product.img3;
let detailImg4 = product.img4;
let detailImg5 = product.img5;
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
        document.getElementById('productImage').src = mainImg;
        document.getElementById('sildeImg2').src = detailImg2;   
        document.getElementById('sildeImg3').src = detailImg3;  
        document.getElementById('sildeImg4').src = detailImg4;  
        document.getElementById('sildeImg5').src = detailImg5;  
        document.getElementById('detailImg2').src = detailImg2;   
        document.getElementById('detailImg3').src = detailImg3;  
        document.getElementById('detailImg4').src = detailImg4;  
        document.getElementById('detailImg5').src = detailImg5;
      

let slideIndex = 0;
let index = 0;
const slides = document.querySelectorAll(".slides img");
showSlide(slideIndex);
function showSlide(slideIndex){
  slides.forEach(slide =>{
    slide.classList.add("hideImg");
  })
  slides[slideIndex].classList.remove("hideImg");
  console.log(slideIndex)
}
function next(){
  index++;
  slideIndex = index - (slides.length)*(Math.floor(index/(slides.length))); 
  showSlide(slideIndex)
  console.log(index);
}
function prev(){
  index -- ;
  if(index >= 0){
    slideIndex = index - (slides.length)*(Math.floor(index/(slides.length)));
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

    if (selectedSize === "Select size") {
        alert("Vui lòng chọn size!");
        return;
    }

    // Lấy số lượng
    const quantitySelect = document.querySelectorAll(".button")[1];
    let quantity = quantitySelect.value === "Quantities" ? 1 : parseInt(quantitySelect.value);

    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra nếu SP + size đã tồn tại trong giỏ
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
            img: selectedProduct.img,
            price: selectedProduct.price,
            size: selectedSize,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
}
