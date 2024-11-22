const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const { uploadImage } = require('../controllers/images');
const router = express.Router();

// Middleware Multer
const upload = multer({ storage });

// Route cho upload file
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
