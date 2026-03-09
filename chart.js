/* ================= FIREBASE ================= */
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= GET SELECTED PRODUCT ================= */
const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

if (!selectedProduct) {
  console.error("❌ Không tìm thấy selectedProduct trong localStorage");
}

/* ================= LOAD PRODUCTS ================= */
let products = [];

async function loadProducts() {
  try {
    products = [];

    const snap = await getDocs(collection(db, "products"));

    snap.forEach(doc => {
      products.push({
        _fid: doc.id,
        ...doc.data()
      });
    });

    console.log("✅ Loaded", products.length, "products");

  } catch (err) {
    console.error("❌ Firestore error:", err);
  }
}

/* ================= FIND PRODUCT ================= */
function getCurrentProduct() {
  if (!selectedProduct) return null;
  return products.find(p => p.id == selectedProduct.id);
}

/* ================= MATERIAL CHART ================= */
function renderMaterialChart(product) {
  if (!product || !product.materials) return;

  /*
    materials trong Firestore dạng:
    {
      "Nylon/Polyester.": 30,
      "Lông Vũ": 70
    }
  */

  const labels = Object.keys(product.materials);
  const values = Object.values(product.materials);

  new Chart(document.getElementById("materialChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#4e3f32",
          "#e8dcd2",
          "#8f8d54",
          "#b19883",
          "#efe6d8"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "55%",
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

/* ================= RATING CHART ================= */
function renderRatingChart(product) {
  if (!product || !product.ratings) return;

  /*
    ratings dạng:
    {
      "Độ bền": 9,
      "Chất lượng": 8.5,
      "Tương đồng": 8.25,
      "Độ hiếm": 7
    }
  */

  const labels = Object.keys(product.ratings);
  const values = Object.values(product.ratings);

  new Chart(document.getElementById("ratingChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        axis: "y",
        data: values,
        borderWidth: 1,
        backgroundColor: "#49840081"
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();

  const product = getCurrentProduct();

  if (!product) {
    console.error("Không tìm thấy sản phẩm theo ID");
    return;
  }

  renderMaterialChart(product);
  renderRatingChart(product);
});
