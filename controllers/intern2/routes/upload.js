// controllers/intern2/routes/upload.js
const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../uploadController');

// Handle image upload
router.post('/image', uploadImage);

// Delete uploaded image
router.delete('/image/:filename', deleteImage);

module.exports = router;