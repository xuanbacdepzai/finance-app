// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZzzGAHu7FJG1fjJ6aS5X5Z0rDibHNjMU",
  authDomain: "thu-chi-2025.firebaseapp.com",
  projectId: "thu-chi-2025",
  storageBucket: "thu-chi-2025.firebasestorage.app",
  messagingSenderId: "526394422431",
  appId: "1:526394422431:web:a3fda3f22024fde6465eaa",
  measurementId: "G-98F63QZ9R7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebase.firestore();

// Khởi tạo biểu đồ
const ctx = document.getElementById('financeChart').getContext('2d');
let financeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Tổng thu', 'Tổng chi', 'Số dư'],
        datasets: [{
            label: 'Số tiền (đ)',
            data: [0, 0, 0],
            backgroundColor: ['green', 'red', 'blue'],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true, display: false },
            x: { display: true }
        },
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Thống kê tháng 5' }
        }
    }
});

// Lấy dữ liệu từ Firestore và cập nhật biểu đồ
async function loadData(month) {
    const docRef = db.collection('financeData').doc(`month_${month}`);
    const doc = await docRef.get();
    let tongThu = 0, tongChi = 0, soDu = 0;

    if (doc.exists) {
        const data = doc.data();
        tongThu = data.tongThu || 0;
        tongChi = data.tongChi || 0;
        soDu = tongThu - tongChi;
    }

    // Cập nhật biểu đồ
    financeChart.data.datasets[0].data = [tongThu, tongChi, soDu];
    financeChart.options.plugins.title.text = `Thống kê tháng ${month}`;
    financeChart.update();

    // Cập nhật giá trị input
    document.getElementById('tongThu').value = tongThu;
    document.getElementById('tongChi').value = tongChi;
}

// Lưu dữ liệu vào Firestore
async function saveData() {
    const month = document.getElementById('month').value;
    const tongThu = parseFloat(document.getElementById('tongThu').value) || 0;
    const tongChi = parseFloat(document.getElementById('tongChi').value) || 0;

    await db.collection('financeData').doc(`month_${month}`).set({
        tongThu: tongThu,
        tongChi: tongChi
    });

    // Tải lại dữ liệu để cập nhật biểu đồ
    loadData(month);
}

// Tải dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    const month = document.getElementById('month').value;
    loadData(month);

    // Cập nhật biểu đồ khi thay đổi tháng
    document.getElementById('month').addEventListener('change', (e) => {
        loadData(e.target.value);
    });
});