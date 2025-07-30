# Posity Backend API Documentation 🚀

This document provides a comprehensive overview of all available API endpoints for the Posity blog application backend.

## Base URL

```
http://localhost:5000
```

---

## 📝 Blog Posts

### Create Post

```http
POST /blog/posts
```

**Description**: Create a new blog post  
**Authentication**: Required  
**Content-Type**: `multipart/form-data` or `application/json`

**Request Body:**

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "category": "Technology",
  "image": "file upload or image URL"
}
```

### Get All Posts

```http
GET /blog/posts
```

**Description**: Retrieve all blog posts with optional pagination and filtering

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of posts per page (default: 10)
- `category` (optional): Filter posts by category name

**Examples:**

```http
GET /blog/posts?page=1&limit=5
GET /blog/posts?page=2&limit=5
GET /blog/posts?category=Technology
GET /blog/posts?category=Health
GET /blog/posts?category=Technology&page=1&limit=3
```

### Get Single Post

```http
GET /blog/posts/:postId
```

**Description**: Retrieve a specific blog post by ID

### Update Post

```http
PUT /blog/posts/:postId
```

**Description**: Update an existing blog post  
**Authentication**: Required (Author only)

### Delete Post

```http
DELETE /blog/posts/:postId
```

**Description**: Delete a blog post  
**Authentication**: Required (Author only)

---

## 💬 Comments

### Create Comment

```http
POST /api/v1/blog/posts/:postId/comments
```

**Description**: Add a comment to a specific blog post  
**Authentication**: Required  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "text": "This is a great blog post! Thanks for sharing."
}
```

### Get Comments

```http
GET /api/v1/blog/posts/:postId/comments
```

**Description**: Retrieve all comments for a specific blog post

### Update Comment

```http
PUT /api/v1/blog/comments/:id
```

**Description**: Update a specific comment  
**Authentication**: Required (Comment author only)

### Delete Comment

```http
DELETE /api/v1/blog/comments/:id
```

**Description**: Delete a specific comment  
**Authentication**: Required (Comment author only)

---

## 🏷️ Categories

> **Note**: Category management is restricted to admin users only

### Create Category

```http
POST /blog/categories
```

**Description**: Create a new blog category  
**Authentication**: Required (Admin only)  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "name": "Technology",
  "description": "Posts related to technology, programming, and software development"
}
```

### Get All Categories

```http
GET /blog/categories
```

**Description**: Retrieve all available categories

### Get Single Category

```http
GET /blog/categories/:id
```

**Description**: Retrieve a specific category by ID

### Update Category

```http
PUT /blog/categories/:id
```

**Description**: Update an existing category  
**Authentication**: Required (Admin only)

### Delete Category

```http
DELETE /blog/categories/:id
```

**Description**: Delete a category  
**Authentication**: Required (Admin only)

---

## 🔐 Authentication

### Sign Up

```http
POST /api/v1/auth/signup
```

**Description**: Register a new user account  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "testmail@example.com",
  "password": "123456789"
}
```

### Sign In

```http
POST /api/v1/auth/signin
```

**Description**: Authenticate user and receive JWT token  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "testmail@example.com",
  "password": "123456789"
}
```

### Verify OTP

```http
POST /api/v1/auth/verify-otp
```

**Description**: Verify OTP for account activation or password reset  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "testmail@example.com",
  "otp": "123456"
}
```

### Forgot Password

```http
POST /api/v1/auth/forgot-password
```

**Description**: Request password reset OTP  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "testmail@example.com"
}
```

### Reset Password

```http
POST /api/v1/auth/reset-password
```

**Description**: Reset password using OTP verification  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "testmail@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

### Resend Verification

```http
POST /api/v1/auth/resend-verification
```

**Description**: Resend verification OTP to user email  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "testmail@example.com"
}
```

### Sign Out

```http
POST /api/v1/auth/signout
```

**Description**: Sign out user and invalidate JWT token  
**Authentication**: Required

### Check Authentication Status

```http
GET /api/v1/auth/check-auth
```

**Description**: Verify if user is currently authenticated  
**Authentication**: Required

---

## 👥 User Management

### Get All Users (Admin Only)

```http
GET /api/v1/users
```

**Description**: Retrieve list of all users  
**Authentication**: Required (Admin only)

### Get User Profile

```http
GET /api/v1/users/profile
```

**Description**: Get current user's profile information  
**Authentication**: Required

### Update User Profile

```http
PUT /api/v1/users/profile
```

**Description**: Update current user's profile  
**Authentication**: Required

### Get User's Posts

```http
GET /api/v1/users/posts
```

**Description**: Retrieve all posts created by the authenticated user  
**Authentication**: Required

### Get User's Comments

```http
GET /api/v1/users/comments
```

**Description**: Retrieve all comments made by the authenticated user  
**Authentication**: Required

### Update User Role (Admin Only)

```http
PUT /api/v1/users/role/:id
```

**Description**: Update a user's role (e.g., promote to admin or demote to user)  
**Authentication**: Required (Admin only)  
**Content-Type**: `application/json`

**Request Body:**

```json
{
  "role": "admin"
}
```

**Note**: Common roles include `user`, `admin`

---

## 🖼️ Profile Image Management

### Update Profile Image

```http
PUT /api/v1/users/profile/:id/image
```

**Description**: Upload or update user profile image  
**Authentication**: Required  
**Content-Type**: `multipart/form-data`

### Delete Profile Image

```http
DELETE /api/v1/users/profile/:id/image
```

**Description**: Remove user profile image  
**Authentication**: Required

---

## 🔒 Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🚨 Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

You can test these endpoints using tools like:

- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)
- **curl** commands

### Example curl request:

```bash
curl -X GET "http://localhost:5000/blog/posts?page=1&limit=5" \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 📝 Notes

- All POST/PUT requests should include appropriate request bodies
- File uploads use `multipart/form-data`
- Pagination starts from page 1
- Default limit for pagination is 10 items per page
- Category filtering is case-sensitive
- Admin routes require elevated permissions

---

For more information about the complete application setup, refer to the main [README.md](../README.md)
