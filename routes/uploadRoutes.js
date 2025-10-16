import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import sharp from 'sharp';

const router = express.Router();

// ImageHosts.site API configuration
const IMAGE_HOST_API_URL = 'https://imagehosts.site/api/upload';
const IMAGE_HOST_API_KEY = 'd8682ede21266c6898c10f67191a80bb3cbd1fcc295de8fece3d58bab322402c';

console.log('🚀 Upload Routes Loaded - ImageHosts.site Integration Active');
console.log('📡 API URL:', IMAGE_HOST_API_URL);

// Ensure uploads directory exists (for temporary storage)
const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage for temporary files
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${base}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/upload - Upload to ImageHosts.site
router.post('/', upload.single('image'), async (req, res) => {
  let tempFilePath = null;

  try {
    console.log('🔵 Upload route called - NEW VERSION with ImageHosts.site');
    
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image file provided (field name must be "image")' 
      });
    }

    tempFilePath = req.file.path;
    console.log('📤 Uploading image to ImageHosts.site:', req.file.originalname);
    console.log('📁 Temporary file path:', tempFilePath);
    console.log('📏 Original file size:', (req.file.size / 1024).toFixed(2), 'KB');

    // Convert and compress the image to optimized WebP format
    const webpPath = tempFilePath.replace(/\.[^.]+$/, '.webp');
    
    try {
      console.log('🔄 Converting and optimizing image to WebP format...');
      
      await sharp(tempFilePath)
        .resize(2000, 2000, { // Max 2000px width/height, maintains aspect ratio
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 90,           // High quality WebP (90% for best results)
          effort: 6,             // Maximum compression effort
          smartSubsample: true   // Better quality at lower file sizes
        })
        .toFile(webpPath);
      
      const webpSize = fs.statSync(webpPath).size;
      console.log('📦 Optimized WebP size:', (webpSize / 1024).toFixed(2), 'KB');
      console.log('💾 Size reduction:', ((1 - webpSize / req.file.size) * 100).toFixed(1), '%');
      console.log('✅ Successfully converted to optimized WebP format');
      
      // Delete original, use optimized WebP
      fs.unlinkSync(tempFilePath);
      tempFilePath = webpPath;
    } catch (conversionError) {
      console.error('❌ Image conversion failed:', conversionError.message);
      // If conversion fails, return error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      return res.status(500).json({
        message: 'Failed to convert and optimize image',
        error: conversionError.message
      });
    }

    // Create form data for ImageHosts.site API
    const webpFilename = req.file.originalname.replace(/\.[^.]+$/, '.webp');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(tempFilePath), {
      filename: webpFilename,
      contentType: 'image/webp' // Optimized WebP format
    });

    // Upload to ImageHosts.site
    const response = await axios.post(IMAGE_HOST_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${IMAGE_HOST_API_KEY}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('✅ Image uploaded successfully to ImageHosts.site');
    console.log('🔗 Live URL:', response.data.url);

    // Delete temporary local file
    fs.unlinkSync(tempFilePath);
    console.log('🗑️ Temporary file deleted');

    // Return the response from ImageHosts.site
    return res.status(201).json(response.data);

  } catch (error) {
    console.error('❌ Error uploading to ImageHosts.site:', error.message);
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code
    });
    
    // Clean up temporary file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️ Temporary file deleted after error');
      } catch (cleanupError) {
        console.error('Error deleting temporary file:', cleanupError);
      }
    }

    // Return error response
    return res.status(500).json({
      message: 'Failed to upload image to image host',
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

export default router;


