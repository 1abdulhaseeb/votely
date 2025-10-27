# API Reference

Complete API documentation for the Votely backend service.

## Base URL

```
http://localhost:3000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### `GET /`

Check if the API is running.

**Response:**
```
Hello World!
```

---

### Authentication Endpoints

#### `POST /auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123!",
  "firstName": "John",      // Optional
  "lastName": "Doe"         // Optional
}
```

**Validation Rules:**
- `email`: Must be a valid email format, unique
- `username`: Must be unique, 3-50 characters
- `password`: Minimum 8 characters
- `firstName`: Optional, max 50 characters
- `lastName`: Optional, max 50 characters

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2025-10-27T11:24:10.000Z",
    "updatedAt": "2025-10-27T11:24:10.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `409 Conflict`: Email or username already exists

---

#### `POST /auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjk4NDA0MjUwLCJleHAiOjE2OTg0MDc4NTB9.example",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "isActive": true
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing email or password

---

#### `GET /auth/profile`

Get current user's profile information. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "isActive": true,
  "createdAt": "2025-10-27T11:24:10.000Z",
  "updatedAt": "2025-10-27T11:24:10.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token

---

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description or array of validation errors",
  "error": "Bad Request"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request data or validation errors
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (duplicate email/username)
- `500 Internal Server Error`: Server error

## Example Usage

### Complete Registration & Login Flow

1. **Register a new user:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "MySecurePass123!",
    "firstName": "New",
    "lastName": "User"
  }'
```

2. **Login with the new user:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MySecurePass123!"
  }'
```

3. **Access profile with JWT token:**

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate Limiting

Currently, no rate limiting is implemented. This will be added in future versions.

## API Versioning

The current API is version 1 and is not versioned in the URL. Future versions will use the format `/api/v1/` or `/api/v2/`.

## CORS

CORS is enabled for all origins in development. In production, it should be configured to allow only specific domains.

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 1 hour (configurable via environment variables)
- User input is validated and sanitized
- SQL injection protection via TypeORM parameterized queries

## Future Endpoints

The following endpoints are planned for future releases:

- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Password reset
- `GET /users` - List users (admin only)
- `POST /votes` - Create a vote
- `GET /votes` - List votes
- `POST /polls` - Create a poll
- `GET /polls` - List polls