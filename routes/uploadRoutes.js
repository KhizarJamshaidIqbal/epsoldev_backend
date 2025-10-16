import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import sharp from 'sharp';

const router = express.Router();

// ImageHosts.site API configuration
const IMAGE_HOST_API_URL = 'https://imagehosts.site/api/upload';
const IMAGE_HOST_API_KEY = 'd8682ede21266c6898c10f67191a80bb3cbd1fcc295de8fece3d58bab322402c';

console.log('🚀 Upload Routes Loaded - ImageHosts.site Integration Active');
console.log('📡 API URL:', IMAGE_HOST_API_URL);

// Use memory storage for Vercel compatibility (serverless is read-only)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/upload - Upload to ImageHosts.site (Vercel-compatible with memory storage)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('🔵 Upload route called - Vercel-compatible version');
    
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image file provided (field name must be "image")' 
      });
    }

    console.log('📤 Uploading image to ImageHosts.site:', req.file.originalname);
    console.log('📏 Original file size:', (req.file.size / 1024).toFixed(2), 'KB');

    let imageBuffer = req.file.buffer;
    let finalFilename = req.file.originalname;

    // Try to optimize with Sharp if available (works on Vercel with proper config)
    try {
      console.log('🔄 Converting and optimizing image to WebP format...');
      
      imageBuffer = await sharp(req.file.buffer)
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 90,
          effort: 6,
          smartSubsample: true
        })
        .toBuffer();
      
      finalFilename = req.file.originalname.replace(/\.[^.]+$/, '.webp');
      console.log('📦 Optimized WebP size:', (imageBuffer.length / 1024).toFixed(2), 'KB');
      console.log('💾 Size reduction:', ((1 - imageBuffer.length / req.file.size) * 100).toFixed(1), '%');
      console.log('✅ Successfully converted to optimized WebP format');
    } catch (conversionError) {
      console.warn('⚠️ Image optimization failed, using original:', conversionError.message);
      // Continue with original buffer if Sharp fails
      imageBuffer = req.file.buffer;
      finalFilename = req.file.originalname;
    }

    // Create form data for ImageHosts.site API
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: finalFilename,
      contentType: finalFilename.endsWith('.webp') ? 'image/webp' : req.file.mimetype
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

    // Return error response
    return res.status(500).json({
      message: 'Failed to upload image to image host',
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

export default router;


