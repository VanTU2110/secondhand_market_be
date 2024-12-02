const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Cho phép frontend ở port 3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookies và headers với xác thực
  }));
  app.options('*', cors());

// Routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const shopRoutes = require('./routes/shop');
const categoryRoutes = require('./routes/category');
const reviewRoutes = require('./routes/review');
const messageRoutes = require('./routes/message');
const routerImages  = require('./routes/upload');
const auth = require('./routes/auth');


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shop',shopRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/reviews',reviewRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/images',routerImages);
app.use('/api/auth',auth);

module.exports = app;
