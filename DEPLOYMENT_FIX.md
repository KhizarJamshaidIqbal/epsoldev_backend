# Production Deployment Fix Guide

## Problem Summary
Your backend works locally but shows **500 Internal Server Error** on production (Dokploy VPS) when accessing `/api/api-tokens`.

## Root Causes Identified

### 1. Missing Error Handler on Production
- The `errorHandler.js` middleware was created locally but not deployed
- Production server doesn't have proper error handling

### 2. Authentication Middleware Issues
- When no JWT token is sent, the auth middleware throws errors
- These errors weren't being caught properly on production

### 3. Controller Defensive Checks Missing
- Controllers didn't check if `req.user` exists before using it
- This caused undefined errors on production

## Files Changed (Need to be Deployed)

### ✅ New Files Created:
1. `middleware/errorHandler.js` - Global error handler
2. `API_TOKEN_AUTHENTICATION.md` - Documentation

### ✅ Modified Files:
1. `server.js` - Added error handler import and usage
2. `middleware/authMiddleware.js` - Better error handling with next(error)
3. `controllers/apiTokenController.js` - Added defensive checks and try-catch blocks

## How to Deploy to Dokploy

### Option 1: Git Push (Recommended)
```bash
# Navigate to server directory
cd "C:\Users\KhizarJamshaidIqbal\Documents\F Drive\khizarjamshaidiqbal\Epsoldev Code\server"

# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Fix: Add error handling middleware and defensive checks for production"

# Push to your repository
git push origin main
```

After pushing, Dokploy should automatically redeploy if you have auto-deploy enabled.

### Option 2: Manual Redeploy in Dokploy
1. Go to your Dokploy dashboard: https://69.57.161.11:3000
2. Navigate to your backend project
3. Click "Rebuild" or "Redeploy" button
4. Wait for deployment to complete

### Option 3: SSH to VPS and Pull Changes
```bash
# SSH to your VPS
ssh root@69.57.161.11

# Navigate to your project directory
cd /path/to/your/backend

# Pull latest changes
git pull origin main

# Restart the application
pm2 restart epsoldev-backend
# OR
docker-compose restart
# OR
systemctl restart your-service-name
```

## Verification Steps

### 1. Check if Server Starts
After deployment, check logs:
```bash
# In Dokploy dashboard, check "Logs" tab
# OR SSH and check logs:
pm2 logs epsoldev-backend
# OR
docker logs <container-name>
```

You should see:
```
✅ API routes registered successfully
🚀 Server running on http://0.0.0.0:5000
```

### 2. Test the API Endpoint
```bash
# Test without authentication (should return proper error now)
curl https://api.epsoldev.com/api/api-tokens

# Expected response (401 instead of 500):
{
  "message": "Access denied. No token provided or invalid format.",
  "timestamp": "2025-11-10T14:50:22.000Z"
}
```

### 3. Test with Authentication
```bash
# 1. Login first
curl -X POST https://api.epsoldev.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-admin@email.com","password":"your-password"}'

# 2. Use the token
curl https://api.epsoldev.com/api/api-tokens \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables Check

Make sure these are set in Dokploy:
```env
NODE_ENV=production
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
PORT=5000
HOST=0.0.0.0
```

## Common Issues After Deployment

### Issue: Still getting 500 error
**Solution**: 
1. Check if all files were deployed
2. Verify `middleware/errorHandler.js` exists on server
3. Check server logs for detailed error

### Issue: "Cannot find module errorHandler"
**Solution**:
```bash
# SSH to server and check if file exists
ls -la middleware/errorHandler.js

# If missing, ensure git push was successful
git status
git log -1
```

### Issue: Database connection error
**Solution**:
1. Check MongoDB connection string in environment variables
2. Verify database is accessible from VPS
3. Check firewall rules

## Quick Deployment Checklist

- [ ] All changes committed to git
- [ ] Changes pushed to repository
- [ ] Dokploy rebuild triggered
- [ ] Deployment completed successfully
- [ ] Server logs show no errors
- [ ] API endpoint returns 401 (not 500) without auth
- [ ] API endpoint works with valid JWT token

## Expected Behavior After Fix

### Before Fix:
```
GET /api/api-tokens (no auth)
→ 500 Internal Server Error
→ "Something went wrong"
```

### After Fix:
```
GET /api/api-tokens (no auth)
→ 401 Unauthorized
→ "Access denied. No token provided or invalid format."
```

### With Valid Auth:
```
GET /api/api-tokens (with JWT)
→ 200 OK
→ { "success": true, "count": 0, "data": [] }
```

## Rollback Plan

If deployment fails:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# OR restore previous deployment in Dokploy
# Go to Deployments → Select previous successful deployment → Restore
```

## Need Help?

1. Check Dokploy logs first
2. SSH to server and check application logs
3. Verify all environment variables are set
4. Test database connectivity
5. Check if all files were deployed correctly

## Contact Information

- VPS IP: 69.57.161.11
- API URL: https://api.epsoldev.com
- Dokploy Dashboard: https://69.57.161.11:3000 (assumed)
