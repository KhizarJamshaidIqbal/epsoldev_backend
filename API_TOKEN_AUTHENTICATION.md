# API Token Authentication Guide

## Overview
The `/api/api-tokens` endpoint is **protected** and requires **admin authentication**. This means you must be logged in as an admin user to access it.

## Why You're Getting a 500 Error

When you visit `https://api.epsoldev.com/api/api-tokens` in your browser, you get an error because:

1. **No Authentication Token**: The browser doesn't send any JWT authentication token
2. **Admin Access Required**: This endpoint requires admin privileges
3. **Protected Route**: The route uses two middleware:
   - `auth` - Verifies JWT token
   - `requireAdmin` - Checks if user is an admin

## How to Access the API Token Endpoints

### Step 1: Login as Admin
First, you need to login and get a JWT token:

```bash
POST https://api.epsoldev.com/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

### Step 2: Use the Token in Requests
Include the token in the Authorization header:

```bash
GET https://api.epsoldev.com/api/api-tokens
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Available API Token Endpoints

### 1. Get All API Tokens
```bash
GET /api/api-tokens
Authorization: Bearer <your-jwt-token>
```

### 2. Get Single API Token
```bash
GET /api/api-tokens/:id
Authorization: Bearer <your-jwt-token>
```

### 3. Create New API Token
```bash
POST /api/api-tokens
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "My API Token",
  "description": "Token for external API access",
  "permissions": ["read", "write"],
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 1000
  }
}
```

### 4. Update API Token
```bash
PUT /api/api-tokens/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Updated Token Name",
  "isActive": true
}
```

### 5. Delete API Token
```bash
DELETE /api/api-tokens/:id
Authorization: Bearer <your-jwt-token>
```

### 6. Revoke API Token
```bash
PUT /api/api-tokens/:id/revoke
Authorization: Bearer <your-jwt-token>
```

### 7. Activate API Token
```bash
PUT /api/api-tokens/:id/activate
Authorization: Bearer <your-jwt-token>
```

### 8. Get API Token Statistics
```bash
GET /api/api-tokens/stats
Authorization: Bearer <your-jwt-token>
```

## Testing with Postman or cURL

### Using cURL:
```bash
# 1. Login first
curl -X POST https://api.epsoldev.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'

# 2. Copy the token from response and use it
curl -X GET https://api.epsoldev.com/api/api-tokens \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Using Postman:
1. Create a new request
2. Set method to GET
3. URL: `https://api.epsoldev.com/api/api-tokens`
4. Go to "Authorization" tab
5. Select "Bearer Token"
6. Paste your JWT token
7. Send request

## Error Messages

### 401 Unauthorized
```json
{
  "message": "Access denied. No token provided or invalid format."
}
```
**Solution**: Include `Authorization: Bearer <token>` header

### 403 Forbidden
```json
{
  "message": "Access denied. Admin privileges required."
}
```
**Solution**: Login with an admin account

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Something went wrong"
}
```
**Solution**: Check server logs for detailed error information

## Security Notes

1. **Never expose JWT tokens**: Keep your JWT tokens secure
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Expiration**: JWT tokens expire after a set time
4. **Admin Only**: Only admin users can manage API tokens
5. **Rate Limiting**: API tokens have rate limits to prevent abuse

## Development vs Production

### Development (Local)
- URL: `http://localhost:5000/api/api-tokens`
- CORS: Enabled for localhost origins
- Error details: Full stack traces shown

### Production (Live)
- URL: `https://api.epsoldev.com/api/api-tokens`
- CORS: Restricted to allowed origins
- Error details: Generic messages only

## Common Issues

### Issue: "Cannot find module debugRoutes.js"
**Fixed**: The debugRoutes.js file now exists and is properly exported

### Issue: 500 Error on /api/api-tokens
**Cause**: Missing authentication or error not properly handled
**Solution**: 
1. Ensure you're sending Authorization header
2. Verify JWT token is valid
3. Check if user has admin privileges

### Issue: CORS Error
**Cause**: Origin not in allowed list
**Solution**: Add your frontend URL to the allowed origins in server.js

## Next Steps

1. **Create Admin User**: Ensure you have an admin user in your database
2. **Test Login**: Test the login endpoint first
3. **Get JWT Token**: Save the JWT token from login response
4. **Test API Tokens**: Use the JWT token to access API token endpoints
5. **Create API Tokens**: Create API tokens for external applications

## Support

If you continue to experience issues:
1. Check server logs for detailed error messages
2. Verify database connection is working
3. Ensure JWT_SECRET is set in environment variables
4. Confirm user has isAdmin: true in database
