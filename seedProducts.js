const mongoose = require('mongoose');
const Product = require('../backend/Models/Product');

// Danh sách shop_id và category_id
const shopIds = [
    "66f026e607e861830ac833e7",
    "66f0337141d06449ca9cc4c9",
    "66f137c3214b8912c0a4fad7",
  ];
  const categoryIds = [
    "66f37bc5ef9afb4921f719cf",
    "66f39133ef9afb4921f71a12",
    "66fcaa305d794c535aa1198e",
    "671604369e3fe4318d38bd0f",
  ];

const products = [
  {
    shop_id: shopIds[1],
    category_id: categoryIds[2],
    title: "Tai nghe Sony WH-1000XM5",
    description: "Tai nghe chống ồn chủ động, pin lên đến 30 giờ, âm thanh Hi-Res.",
    img_url: [
      "https://example.com/images/sony-wh1000xm5-1.jpg",
    ],
    price: 349,
    quantity: 20,
    condition: "new",
  },
  {
    shop_id: shopIds[2],
    category_id: categoryIds[1],
    title: "Máy lọc không khí Xiaomi Mi Air Purifier 4",
    description: "Máy lọc không khí hiệu quả, phù hợp cho phòng 20-30m².",
    img_url: [
      "https://example.com/images/mi-air-purifier-1.jpg",
    ],
    price: 129,
    quantity: 50,
    condition: "new",
  },
  {
    shop_id: shopIds[0],
    category_id: categoryIds[3],
    title: "Lò vi sóng Panasonic NN-GD37",
    description: "Lò vi sóng 23L, nấu ăn nhanh, chức năng nướng tiện lợi.",
    img_url: [
      "https://example.com/images/panasonic-microwave-1.jpg",
    ],
    price: 199,
    quantity: 10,
    condition: "new",
  },
  {
    shop_id: shopIds[2],
    category_id: categoryIds[0],
    title: "Laptop Apple MacBook Air M2",
    description: "MacBook Air mới nhất với chip M2, 16GB RAM, 512GB SSD.",
    img_url: [
      "https://example.com/images/macbook-air-m2-1.jpg",
    ],
    price: 1399,
    quantity: 5,
    condition: "new",
  },
  {
    shop_id: shopIds[1],
    category_id: categoryIds[3],
    title: "Tủ lạnh Samsung Inverter 208L",
    description: "Tủ lạnh 2 cửa tiết kiệm điện, thiết kế sang trọng.",
    img_url: [
      "https://example.com/images/samsung-fridge-1.jpg",
    ],
    price: 399,
    quantity: 12,
    condition: "new",
  },
  {
    shop_id: shopIds[0],
    category_id: categoryIds[1],
    title: "Đèn bàn LED Rạng Đông",
    description: "Đèn bàn LED ánh sáng tự nhiên, bảo vệ mắt, điều chỉnh độ sáng.",
    img_url: [
      "https://example.com/images/rang-dong-lamp-1.jpg",
    ],
    price: 49,
    quantity: 100,
    condition: "new",
  },
  {
    shop_id: shopIds[2],
    category_id: categoryIds[0],
    title: "Điện thoại iPhone 15 Pro Max",
    description: "iPhone 15 Pro Max với chip A17, camera nâng cấp, thiết kế titan.",
    img_url: [
      "https://example.com/images/iphone-15-pro-max-1.jpg",
    ],
    price: 1599,
    quantity: 8,
    condition: "new",
  },
  {
    shop_id: shopIds[2],
    category_id: categoryIds[2],
    title: "Loa Bluetooth JBL Charge 5",
    description: "Loa Bluetooth di động chống nước IP67, pin 20 giờ.",
    img_url: [
      "https://example.com/images/jbl-charge-5-1.jpg",
    ],
    price: 179,
    quantity: 25,
    condition: "new",
  },
  {
    shop_id: shopIds[1],
    category_id: categoryIds[3],
    title: "Máy làm mát không khí Daikio DK-5000C",
    description: "Máy làm mát không khí di động, làm mát hiệu quả cho mùa hè.",
    img_url: [
      "https://example.com/images/daikio-cooler-1.jpg",
    ],
    price: 249,
    quantity: 15,
    condition: "new",
  },
  {
    shop_id: shopIds[0],
    category_id: categoryIds[1],
    title: "Ổ điện Xiaomi Power Strip 3",
    description: "Ổ điện thông minh với 3 cổng USB và bảo vệ quá tải.",
    img_url: [
      "https://example.com/images/xiaomi-power-strip-2.jpg",
    ],
    price: 29,
    quantity: 50,
    condition: "new",
  },
    // Thêm các sản phẩm khác tương tự
  ];
  
  // Export hoặc insert trực tiếp vào MongoDB:
  module.exports = products;
  async function insertProducts() {
    try {
      await Product.insertMany(products);
      console.log('Dữ liệu đã được thêm thành công!');
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm sản phẩm:', error);
    } finally {
      mongoose.connection.close();
    }
  }
  
  // Kết nối MongoDB và chạy hàm chèn sản phẩm
  mongoose
    .connect('mongodb://localhost:27017/secondHandMarketplace', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Kết nối database thành công!');
      insertProducts();
    })
    .catch((err) => console.error('Kết nối database thất bại:', err));