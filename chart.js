const productss = JSON.parse(localStorage.getItem('selectedProduct'));
const productId = productss.id;
console.log(productId);
async function loadMaterialData() {
    const res = await fetch("product_list.json");
    const data = await res.json();
    const chart = data.find(p => p.id == productId);
    return chart.materials;
        }
        async function renderChart() {
            const materials = await loadMaterialData();

            const labels = Object.keys(materials);
            const values = Object.values(materials);

            new Chart(document.getElementById("materialChart"), {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            "#8f8d54",
                            "#4e3f32",
                            "#b19883",
                            "#e8dcd2",
                            "#efe6d8"
                            
                        ]
                    }]
                },
                options: {
                    responsive: true,    // 👈 CHÍNH LÀ TÍNH NĂNG RESPONSIVE
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

        renderChart();
    //==============================================================================
document.addEventListener("DOMContentLoaded", () => {

    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (!selectedProduct) {
        console.error("Không tìm thấy selectedProduct trong localStorage");
        return;
    }

    const productId = selectedProduct.id;


    async function loadRatingData() {
        const res = await fetch("product_list.json");
        const data = await res.json();

        const product = data.find(p => p.id == productId);

        if (!product) {
            console.error("Không tìm thấy sản phẩm trong JSON");
            return null;
        }

        if (!product.ratings) {
            console.error("Sản phẩm không có ratings");
            return null;
        }

        return product.ratings;
    }


    async function renderRatingChart() {
        const ratings = await loadRatingData();
        if (!ratings) return;

        const labels = Object.keys(ratings);  
        const values = Object.values(ratings);  

        new Chart(document.getElementById("ratingChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    axis: 'y',
                    data: values,
                    borderWidth: 1,
                    backgroundColor: "#8f8d54"
                }]
            },
            options: {
                indexAxis: 'y',        // 💡 Chart ngang
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

    renderRatingChart();

});