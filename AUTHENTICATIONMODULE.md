# Authentication Module — CampusHub

> JWT + HttpOnly Cookie authentication with Google OAuth and Role-Based Access Control for students and admins.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [File Structure](#file-structure)
4. [Authentication Flow](#authentication-flow)
5. [API Reference](#api-reference)
6. [Role-Based Access Control](#role-based-access-control)
7. [Password Reset Flow](#password-reset-flow)
8. [Google OAuth Flow](#google-oauth-flow)
9. [Frontend Pages](#frontend-pages)
10. [Environment Variables](#environment-variables)
11. [Setup & Getting Started](#setup--getting-started)

---

## Architecture Overview

```
Browser (Next.js)            Express API               MongoDB
     │                           │                        │
     │──POST /api/auth/login──►  │                        │
     │                           │── findUser() ─────────►│
     │                           │◄─ user ────────────────│
     │                           │── generateJWT()        │
     │◄── HttpOnly Cookie ───────│                        │
     │                           │                        │
     │──GET /api/auth/me ──────► │                        │
     │   (cookie auto-sent)      │── verifyJWT()          │
     │                           │── findById() ─────────►│
     │◄── { user } ─────────────│◄─ user ────────────────│
```

**Key decisions:**

| Decision | Choice | Rationale |
|---|---|---|
| Token Storage | HttpOnly Cookie | Prevents XSS token theft |
| Token Type | JWT (HS256) | Stateless, scalable |
| Password Hashing | bcryptjs (cost=12) | Industry standard |
| Google Auth | ID Token via `@react-oauth/google` | Official Google library |
| Frontend State | Custom React Context | Full control, no auth library lock-in |
| Route Protection | Next.js Edge Middleware | Zero-latency, runs before page render |

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| `jsonwebtoken` | JWT sign & verify |
| `bcryptjs` | Password hashing |
| `cookie-parser` | Parse HttpOnly cookies |
| `google-auth-library` | Verify Google ID tokens |
| `nodemailer` | Send password reset emails |

### Frontend
| Package | Purpose |
|---|---|
| `@react-oauth/google` | Google login button & token |
| `axios` | API client with `withCredentials` |
| `next/navigation` | Role-based redirects |

---

## File Structure

```
campus-hub/
├── server/
│   └── src/
│       ├── controllers/
│       │   └── auth.controller.js      # All auth business logic
│       ├── middleware/
│       │   └── auth.middleware.js      # protect + authorize()
│       ├── models/
│       │   └── User.js                 # User schema (bcrypt pre-save)
│       ├── routes/
│       │   ├── auth.routes.js          # /api/auth/* endpoints
│       │   └── index.js                # Mounts auth routes
│       ├── utils/
│       │   ├── jwt.utils.js            # generateToken, attachCookie, clearCookie
│       │   └── email.utils.js          # sendPasswordResetEmail (Nodemailer)
│       └── app.js                      # Express app (cors + cookie-parser)
│
└── client/
    └── src/
        ├── app/
        │   ├── (auth)/                 # Auth route group (no shared layout)
        │   │   ├── layout.tsx
        │   │   ├── login/page.tsx
        │   │   ├── signup/page.tsx
        │   │   ├── forgot-password/page.tsx
        │   │   └── reset-password/page.tsx
        │   ├── globals.css             # CampusHub design tokens
        │   └── layout.tsx              # Root layout (Inter font, Providers)
        ├── components/
        │   ├── Providers.tsx           # GoogleOAuthProvider + AuthProvider
        │   └── auth/
        │       ├── AuthLayout.tsx      # Shared auth page shell
        │       ├── AuthFormElements.tsx # InputField, PrimaryButton, etc.
        │       └── GoogleLoginButton.tsx
        ├── context/
        │   └── AuthContext.tsx         # Session state + all auth actions
        ├── hooks/
        │   └── useAuth.ts              # useAuth() hook
        ├── lib/
        │   ├── axios.ts                # Axios instance (withCredentials)
        │   └── auth.types.ts           # TypeScript types
        └── middleware.ts               # Next.js route guard (Edge runtime)
```

---

## Authentication Flow

### Email / Password Login

```
1. User submits email + password
2. POST /api/auth/login
3. Server: find user, comparePassword() (bcrypt)
4. Server: generateToken(userId, role) → JWT
5. Server: attachCookie(res, token) → Set-Cookie: campus_hub_token (HttpOnly)
6. Client: AuthContext.login() → setUser(data.user)
7. Client: role-based redirect (admin → /admin/dashboard, student → /dashboard)
```

### Registration

```
1. User fills name, email, password, confirm password
2. POST /api/auth/register
3. Server: validate, check duplicate email
4. Server: User.create() → bcrypt pre-save hook hashes password
5. Same as login steps 4-7
```

### Session Persistence

```
1. On app load, AuthProvider mounts
2. GET /api/auth/me (cookie sent automatically by browser)
3. Server: protect middleware verifies JWT → returns user
4. AuthContext: setUser(data.user) → isAuthenticated = true
5. If 401 → user = null, redirect to /login (via middleware)
```

---

## API Reference

### Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Create new student account |
| `POST` | `/login` | ❌ | Email/password sign in |
| `POST` | `/google` | ❌ | Google OAuth sign in/up |
| `POST` | `/logout` | ✅ | Clear session cookie |
| `GET` | `/me` | ✅ | Get current user profile |
| `POST` | `/forgot-password` | ❌ | Send reset link via email |
| `POST` | `/reset-password` | ❌ | Set new password with token |

### Request / Response Examples

**POST `/register`**
```json
// Request
{ "fullName": "Jane Doe", "email": "jane@uni.edu", "password": "SecurePass1!" }

// Response 201
{ "success": true, "user": { "_id": "...", "fullName": "Jane Doe", "role": "student", ... } }
// Cookie: campus_hub_token (HttpOnly, Secure in prod)
```

**POST `/google`**
```json
// Request
{ "credential": "<google_access_token>" }

// Response 200 — same shape as register
```

**POST `/forgot-password`**
```json
// Request
{ "email": "jane@uni.edu" }

// Response 200 (always, prevents enumeration)
{ "success": true, "message": "If an account with that email exists, a reset link has been sent." }
```

**POST `/reset-password`**
```json
// Request
{ "token": "<plain_token_from_email>", "password": "NewSecurePass1!" }

// Response 200 — logs in automatically
{ "success": true, "user": { ... } }
```

---

## Role-Based Access Control

### Backend — Protecting Routes

```js
const { protect, authorize } = require('../middleware/auth.middleware');

// Any authenticated user
router.get('/profile', protect, profileController.get);

// Admin only
router.delete('/users/:id', protect, authorize('admin'), userController.delete);

// Student only
router.post('/listings', protect, authorize('student'), listingController.create);

// Both roles
router.get('/listings', protect, authorize('admin', 'student'), listingController.list);
```

### Frontend — Route Guard (Next.js Middleware)

The `src/middleware.ts` runs at the Edge before every request:

```
Request to /admin/* 
  → no token        → redirect /login
  → token, role=student → redirect /dashboard
  → token, role=admin   → allow through

Request to /login (with valid token)
  → redirect /dashboard (already logged in)
```

---

## Password Reset Flow

```
1. User visits /forgot-password, submits email
2. POST /api/auth/forgot-password
3. Server: generate 32-byte random token (crypto.randomBytes)
4. Server: store SHA-256 HASH of token in DB (passwordResetToken)
5. Server: set passwordResetExpires = now + 15 minutes
6. Server: email plain token as URL: /reset-password?token=<plain>
7. User clicks link → /reset-password?token=<plain>
8. User submits new password
9. POST /api/auth/reset-password { token, password }
10. Server: hash token, find user where hash matches + not expired
11. Server: set new password (triggers bcrypt pre-save), clear reset fields
12. Server: return JWT cookie → user auto-logged in
```

> **Security**: Only the hashed token is stored in MongoDB. The plain token only ever exists in the email link. Even if the DB is breached, reset tokens cannot be used.

---

## Google OAuth Flow

```
1. User clicks "Continue with Google"
2. GoogleLoginButton → useGoogleLogin() → Google popup
3. User selects account → Google returns access_token
4. POST /api/auth/google { credential: access_token }
5. Server: googleClient.verifyIdToken() → validates with Google
6. Server: extract { googleId, email, name, picture }
7. Server: find user by googleId OR email
   a. Found + no googleId → link googleId (account merging)
   b. Not found → create new user (isVerified = true)
8. Server: return JWT cookie
```

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/login` | `LoginPage` | Email/password + Google + forgot password link |
| `/signup` | `SignupPage` | Registration with password strength meter |
| `/forgot-password` | `ForgotPasswordPage` | Email submission + success state |
| `/reset-password` | `ResetPasswordPage` | Token from URL + new password |

All pages use the shared `AuthLayout` component that implements the CampusHub Stitch design system (glassmorphic card, ambient glow, branding panel).

---

## Environment Variables

### Server (`server/.env`)

```env
JWT_SECRET=             # Long random string (min 32 chars)
JWT_EXPIRES_IN=7d       # Token lifetime
JWT_COOKIE_EXPIRES_IN=7 # Cookie lifetime in days
GOOGLE_CLIENT_ID=       # From Google Cloud Console
GOOGLE_CLIENT_SECRET=   # From Google Cloud Console
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=             # Gmail address
EMAIL_PASS=             # Gmail App Password (not your account password)
EMAIL_FROM=             # e.g. "CampusHub <no-reply@campushub.com>"
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=  # Same as server GOOGLE_CLIENT_ID
```

---

## Setup & Getting Started

### 1. Google Cloud Console Setup

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Google Identity (OAuth 2.0)**
3. Create OAuth 2.0 credentials (Web Application type)
4. Add Authorised JavaScript origins: `http://localhost:3000`
5. Add Authorised redirect URIs: `http://localhost:3000`
6. Copy **Client ID** → set in both `.env` files

### 2. Gmail App Password (for email)

1. Enable 2FA on your Gmail account
2. Visit Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Set `EMAIL_USER` and `EMAIL_PASS` in `server/.env`

### 3. Run the project

```bash
# Start backend
cd server
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

### 4. Test endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@uni.edu","password":"Password1!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@uni.edu","password":"Password1!"}'

# Get current user (with cookie)
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

---

## Security Notes

- **Passwords** are hashed with `bcryptjs` at cost factor 12 (never stored in plain text)
- **JWT** is stored in an `HttpOnly` cookie — inaccessible to JavaScript, preventing XSS
- **CORS** is configured with `credentials: true` and explicit `origin` (no wildcard)
- **Password reset tokens** are stored as SHA-256 hashes in the database
- **Email enumeration** is prevented — `/forgot-password` always returns the same message
- **Role self-assignment** is blocked — users cannot register as admin
- **Inactive accounts** are rejected at login, Google auth, and the `protect` middleware
- **Cookie security**: `Secure` flag enabled in production, `SameSite: lax` prevents CSRF
