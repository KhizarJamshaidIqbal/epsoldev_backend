# Vercel Deployment Fix Guide

## Issues Fixed

### 1. **Top-Level Await Issue**
- **Problem**: Vercel serverless functions don't handle top-level `await` well
- **Solution**: Wrapped database connection in async function `initializeDB()` that runs non-blocking

### 2. **Sharp Package Compatibility**
- **Problem**: Sharp has native binaries that can fail on Vercel
- **Solution**: 
  - Added proper error handling with try-catch
  - Falls back to original image if Sharp optimization fails
  - Works with memory buffers instead of files

### 3. **File System Operations**
- **Problem**: Vercel serverless is read-only, can't write to disk
- **Solution**: 
  - Changed from `multer.diskStorage()` to `multer.memoryStorage()`
  - Process images in memory using buffers
  - No temporary file creation needed

## Changes Made

### `server.js`
```javascript
// Before (caused issues):
isDbConnected = await connectDB();

// After (Vercel-compatible):
const initializeDB = async () => {
  try {
    isDbConnected = await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
initializeDB();
```

### `uploadRoutes.js`
```javascript
// Before (disk storage):
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${base}-${unique}${ext}`);
  }
});

// After (memory storage):
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
```

### `vercel.json`
Added proper configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb",
        "includeFiles": ["config/**", "routes/**", "middleware/**", "models/**"]
      }
    }
  ],
  "functions": {
    "server.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

## Deployment Steps

### 1. **Ensure Environment Variables are Set in Vercel**
Go to your Vercel project settings and add:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `FRONTEND_URL` - Your frontend URL
- `CLIENT_URL` - Your client URL
- Any other environment variables from your `.env` file

### 2. **Deploy to Vercel**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

Or push to your Git repository if connected to Vercel.

### 3. **Check Deployment Logs**
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the latest deployment
- Check "Functions" tab for any errors
- View runtime logs

## Testing After Deployment

### Test Endpoints:
1. **Root**: `https://your-app.vercel.app/`
2. **Health Check**: `https://your-app.vercel.app/api/health`
3. **Test**: `https://your-app.vercel.app/api/test`
4. **Upload**: `https://your-app.vercel.app/api/upload` (POST with image)

### Test Upload with cURL:
```bash
curl -X POST https://your-app.vercel.app/api/upload \
  -F "image=@/path/to/your/image.jpg"
```

## Common Issues & Solutions

### Issue: "FUNCTION_INVOCATION_FAILED"
**Causes:**
- Missing environment variables
- Package compatibility issues
- Timeout (function took too long)

**Solutions:**
- Check all environment variables are set in Vercel
- Increase `maxDuration` in vercel.json (max 10s for Hobby plan)
- Check function logs for specific errors

### Issue: Sharp fails on Vercel
**Solution:** Already handled! The code now:
1. Tries to use Sharp for optimization
2. Falls back to original image if Sharp fails
3. Continues upload process either way

### Issue: MongoDB connection timeout
**Solution:**
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs)
- Or add Vercel's IP ranges to MongoDB whitelist
- Connection is now non-blocking, won't crash the function

## Performance Tips

1. **Cold Starts**: First request may be slow (2-5s), subsequent requests are fast
2. **Memory**: Increased to 1024MB for image processing
3. **Timeout**: Set to 10s (max for Hobby plan)
4. **Image Size**: Limited to 10MB to prevent timeout

## Monitoring

Check these in Vercel Dashboard:
- **Function Logs**: Real-time logs of your serverless function
- **Analytics**: Request count, response times
- **Errors**: Any runtime errors

## Need Help?

If deployment still fails:
1. Check Vercel function logs
2. Verify all environment variables
3. Test endpoints individually
4. Check MongoDB connection string
5. Ensure all dependencies are in package.json

## Success Indicators

✅ Server starts without errors
✅ Database connects (may take a few seconds)
✅ All API endpoints respond
✅ Image upload works with optimization
✅ No FUNCTION_INVOCATION_FAILED errors
