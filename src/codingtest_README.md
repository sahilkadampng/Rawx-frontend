# 🏪 Store Rating Platform

A full-stack web application where users can rate stores registered on the platform. Built with **Express.js**, **MySQL**, and **React.js**.

---

## 📌 What This App Does (In Simple Words)

This is a platform where:
- **Admin** manages everything — adds users, adds stores, sees all data
- **Normal Users** sign up, browse stores, and give ratings (1 to 5 stars)
- **Store Owners** see their store's average rating and who rated them

There is **one login page** for all 3 roles. After login, each role sees a different dashboard.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│                 │  HTTP   │                 │  SQL    │              │
│   React.js      │ ──────► │   Express.js    │ ──────► │    MySQL     │
│   (Port 3000)   │ ◄────── │   (Port 5000)   │ ◄────── │   Database   │
│                 │  JSON   │                 │  Data   │              │
└─────────────────┘         └─────────────────┘         └──────────────┘
     Frontend                   Backend API                Database
```

**How they talk:**
1. User clicks something on the React frontend
2. React sends an HTTP request (using Axios) to the Express backend API
3. Express processes the request, talks to MySQL database
4. Express sends back a JSON response
5. React displays the data to the user

---

## 🔐 Authentication Flow (How Login Works)

```
1. User enters email + password on Login page
2. Frontend sends POST /api/auth/login to backend
3. Backend checks email in MySQL → finds user
4. Backend compares password using bcrypt (hashed password comparison)
5. If correct → Backend creates a JWT token containing {id, name, email, role}
6. Backend sends token back to frontend
7. Frontend stores token in localStorage
8. For every future request, frontend sends token in the header:
   Authorization: Bearer <token>
9. Backend middleware checks this token before allowing access
```

**Key Concepts:**
- **bcrypt** — We never store plain passwords. We hash them. When user logs in, we hash the input and compare with stored hash.
- **JWT (JSON Web Token)** — A signed token containing user info. Expires in 24 hours. No need to query DB on every request to know who the user is.
- **Middleware** — Code that runs BEFORE the route handler. We use it to verify the token and check user role.

---

## 📁 Project Structure Explained

### Backend (`/backend`)

```
backend/
├── server.js                  ← Entry point. Sets up Express app, CORS, routes
├── package.json               ← Dependencies and npm scripts
├── .env                       ← Environment variables (DB credentials, JWT secret)
│
├── config/
│   └── db.js                  ← Creates MySQL connection pool (reusable connections)
│
├── middleware/
│   ├── auth.js                ← JWT verification + role checking middleware
│   └── validators.js          ← Input validation rules using express-validator
│
├── controllers/               ← Business logic (what happens when API is called)
│   ├── auth.controller.js     ← Signup, Login, Update Password logic
│   ├── admin.controller.js    ← Admin CRUD operations
│   ├── user.controller.js     ← User store browsing + rating logic
│   └── store.controller.js    ← Store owner dashboard logic
│
├── routes/                    ← URL mapping (which URL → which controller function)
│   ├── auth.routes.js         ← /api/auth/* routes
│   ├── admin.routes.js        ← /api/admin/* routes (admin-only)
│   ├── user.routes.js         ← /api/user/* routes (user-only)
│   └── store.routes.js        ← /api/store-owner/* routes (store owner-only)
│
└── database/
    ├── schema.sql             ← CREATE TABLE statements
    ├── seed.sql               ← Insert default admin user (SQL version)
    └── seed.js                ← Insert default admin user (Node.js version)
```

### Frontend (`/frontend/src`)

```
frontend/src/
├── App.js                     ← Main component. Defines all routes
├── App.css                    ← All CSS styling for the entire app
├── index.js                   ← React entry point (renders App)
│
├── api/
│   └── axios.js               ← Axios instance with base URL + auth token interceptor
│
├── context/
│   └── AuthContext.js          ← React Context for global auth state (who is logged in?)
│
├── utils/
│   └── validation.js           ← Client-side form validation functions
│
├── components/                 ← Reusable UI pieces
│   ├── Navbar.js               ← Top navigation bar (shows different links per role)
│   ├── ProtectedRoute.js       ← Route guard (redirects if not logged in or wrong role)
│   ├── RatingStars.js          ← Star rating widget (★★★☆☆) — clickable for input
│   └── FilterBar.js            ← Reusable filter/search bar for tables
│
├── pages/
│   ├── Login.js                ← Login page (email + password)
│   ├── Signup.js               ← Registration page (name, email, address, password)
│   ├── UpdatePassword.js       ← Change password page (all roles)
│   │
│   ├── admin/                  ← Admin-only pages
│   │   ├── Dashboard.js        ← Shows total users, stores, ratings count
│   │   ├── UserList.js         ← Table of all users with filters + sorting
│   │   ├── UserDetail.js       ← Single user's full details
│   │   ├── StoreList.js        ← Table of all stores with ratings
│   │   ├── AddUser.js          ← Form to add new admin/normal user
│   │   └── AddStore.js         ← Form to add new store (assigns owner)
│   │
│   ├── user/                   ← Normal user pages
│   │   └── StoreList.js        ← Browse stores + submit/modify ratings
│   │
│   └── storeowner/             ← Store owner pages
│       └── Dashboard.js        ← See average rating + list of raters
```

---

## 🗄️ Database Design (3 Tables)

```
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│       users         │       │       stores         │       │      ratings         │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │──┐    │ id (PK)             │──┐    │ id (PK)             │
│ name                │  │    │ name                │  │    │ user_id (FK→users)  │
│ email (UNIQUE)      │  │    │ email               │  │    │ store_id (FK→stores)│
│ password (hashed)   │  ├───►│ address             │  ├───►│ rating (1-5)        │
│ address             │  │    │ owner_id (FK→users) │  │    │ created_at          │
│ role (enum)         │  │    │ created_at          │  │    │ updated_at          │
│ created_at          │  │    └─────────────────────┘  │    └─────────────────────┘
└─────────────────────┘  │                              │
                         │    Relationships:             │
                         │    • owner_id → users.id      │
                         │    • UNIQUE(user_id, store_id)│ ← One rating per user per store
                         └──────────────────────────────┘
```

**Role field values:** `'admin'`, `'user'`, `'store_owner'`

**Key design decisions:**
- `UNIQUE(user_id, store_id)` in ratings table ensures a user can only rate a store once
- `ON DELETE CASCADE` on ratings means if a user/store is deleted, their ratings are auto-deleted
- `ON DELETE SET NULL` on stores.owner_id means if owner is deleted, store remains but owner becomes NULL
- Passwords are **never stored in plain text** — always bcrypt hashed

---

## 🔗 API Endpoints (What URLs the Backend Provides)

### Authentication (Public)
| Method | URL | What It Does |
|--------|-----|--------------|
| POST | `/api/auth/signup` | Register a new normal user |
| POST | `/api/auth/login` | Login → returns JWT token |
| PUT | `/api/auth/update-password` | Change password (needs token) |

### Admin Routes (Admin only)
| Method | URL | What It Does |
|--------|-----|--------------|
| GET | `/api/admin/dashboard` | Get counts: total users, stores, ratings |
| POST | `/api/admin/users` | Create a new user (admin or normal) |
| GET | `/api/admin/users` | List all users (with filters & sorting) |
| GET | `/api/admin/users/:id` | Get one user's full details |
| POST | `/api/admin/stores` | Create a new store (assigns owner) |
| GET | `/api/admin/stores` | List all stores with ratings |

### Normal User Routes (User only)
| Method | URL | What It Does |
|--------|-----|--------------|
| GET | `/api/user/stores` | Browse all stores with my rating |
| POST | `/api/user/stores/:id/rate` | Submit a new rating (1-5) |
| PUT | `/api/user/stores/:id/rate` | Modify my existing rating |

### Store Owner Routes (Store Owner only)
| Method | URL | What It Does |
|--------|-----|--------------|
| GET | `/api/store-owner/dashboard` | See average rating + who rated |

---

## 🧩 How Each Part Works (Interview Explanation)

### 1. Connection Pool (`config/db.js`)
Instead of opening a new database connection for every request (slow), we create a **pool** of 10 connections that are reused. This is like having 10 phone lines instead of 1 — multiple requests can talk to the DB at the same time.

### 2. Middleware (`middleware/auth.js`)
Middleware is a function that runs **before** the actual route handler:
```
Request → [Auth Middleware] → [Role Middleware] → [Controller]
```
- `authenticateToken`: Checks if JWT token is valid
- `authorizeRoles('admin')`: Checks if the logged-in user has the right role

### 3. Validators (`middleware/validators.js`)
Uses `express-validator` library to validate input BEFORE it reaches the controller:
- **Name**: 20-60 characters
- **Email**: Must be valid email format
- **Password**: 8-16 chars, at least 1 uppercase letter, at least 1 special character
- **Address**: Maximum 400 characters
- **Rating**: Integer between 1 and 5

If validation fails, it returns a 400 error with specific field-level error messages.

### 4. Controllers (Business Logic)
Each controller function follows this pattern:
```javascript
async (req, res) => {
  try {
    // 1. Get data from request (req.body, req.params, req.query)
    // 2. Query the database
    // 3. Send JSON response
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, message: 'Error...' });
  }
}
```

### 5. React Context (`context/AuthContext.js`)
React Context is used for **global state**. Instead of passing user info through every component as props, any component can access:
- `user` — who is logged in (decoded from JWT)
- `login(token)` — saves token, decodes user info
- `logout()` — clears token, redirects to login

### 6. Protected Routes (`components/ProtectedRoute.js`)
A wrapper component that checks:
1. Is the user logged in? If no → redirect to `/login`
2. Does the user have the right role? If no → redirect to their dashboard

```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />    {/* Only admin can see this */}
</ProtectedRoute>
```

### 7. Axios Interceptor (`api/axios.js`)
The axios instance automatically:
- **Request interceptor**: Adds `Authorization: Bearer <token>` header to every API call
- **Response interceptor**: If API returns 401 (unauthorized), auto-redirects to login page

### 8. Star Rating Component (`components/RatingStars.js`)
A reusable component that:
- Shows filled (★) and empty (☆) stars
- Can be **interactive** (clickable to submit rating) or **read-only** (display only)
- Supports different sizes (small, medium, large)

---

## ✅ Form Validations (Both Frontend & Backend)

| Field | Rule | Why |
|-------|------|-----|
| Name | 20-60 characters | Ensures meaningful names, prevents abuse |
| Email | Valid email format | Standard email validation |
| Password | 8-16 chars, 1 uppercase, 1 special char | Security requirement |
| Address | Max 400 characters | Prevents excessively long addresses |
| Rating | Integer 1-5 | Valid rating range |

**Validation happens at 2 levels:**
1. **Frontend** (React) — Shows errors immediately before sending to server
2. **Backend** (Express-validator) — Server-side validation as a safety net

---

## 🔒 Security Measures

| What | How | Why |
|------|-----|-----|
| Password Storage | bcrypt with 10 salt rounds | Passwords can't be reversed even if DB is hacked |
| Authentication | JWT tokens (24h expiry) | Stateless auth, no session storage needed |
| Authorization | Role-based middleware | Each role can only access their own routes |
| Input Validation | express-validator | Prevents SQL injection, invalid data |
| CORS | Configured for localhost:3000 only | Only our frontend can call the API |
| SQL Injection | Parameterized queries (`?` placeholders) | User input is never directly in SQL |

---

## 🖥️ How to Run

### Prerequisites
- Node.js (v14+)
- MySQL Server running
- npm

### Step 1: Setup Database
```sql
-- In MySQL shell or MySQL Workbench:
SOURCE C:/Users/sahil/coding test/backend/database/schema.sql;
```

### Step 2: Configure Backend
```bash
# Edit backend/.env with your MySQL password
DB_PASSWORD=your_mysql_password
```

### Step 3: Seed Admin User
```bash
cd backend
npm run seed
```
This creates the default admin: **admin@admin.com** / **Admin@1234**

### Step 4: Start Backend
```bash
cd backend
npm start        # Production
npm run dev      # Development (auto-restart with nodemon)
```
Backend runs at **http://localhost:5000**

### Step 5: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs at **http://localhost:3000**

---

## 🧪 Test the Application

1. **Login as Admin**: `admin@admin.com` / `Admin@1234`
2. **Add a normal user** from Admin → Add User
3. **Add a store** from Admin → Add Store (assigns a user as store owner)
4. **Logout**, then **signup as a new normal user**
5. **Login as normal user** → Browse stores → Rate a store (1-5 stars)
6. **Login as store owner** → See dashboard with average rating and rater list

---

## 📦 Technologies & Libraries Used

### Backend
| Library | Purpose |
|---------|---------|
| express | Web framework for Node.js |
| mysql2 | MySQL driver with Promise support |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT token creation & verification |
| express-validator | Input validation |
| cors | Cross-Origin Resource Sharing |
| dotenv | Environment variable management |

### Frontend
| Library | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Client-side routing |
| axios | HTTP client for API calls |

---

## 💡 Key Interview Points

### Why Express.js?
Lightweight, minimalist, widely adopted. Good for REST APIs. Huge ecosystem of middleware.

### Why MySQL?
Relational data (users → stores → ratings) fits perfectly in a relational database. ACID compliance ensures data integrity.

### Why JWT over Sessions?
- **Stateless** — Server doesn't need to store session data
- **Scalable** — Works across multiple servers
- **Self-contained** — Token itself contains user info (id, role)

### Why Connection Pool?
Creating a new DB connection per request is expensive (~20-50ms). A pool keeps connections ready, reducing response time to ~1-2ms.

### Why Validate on Both Frontend and Backend?
- Frontend validation = better user experience (instant feedback)
- Backend validation = security (frontend can be bypassed)
- **Never trust the client** — always validate on the server

### Why bcrypt over SHA256?
bcrypt is specifically designed for passwords. It's intentionally slow (prevents brute force attacks) and includes salt (prevents rainbow table attacks).

### MVC Pattern Used?
Yes — **Model** (database queries in controllers), **View** (React components), **Controller** (Express controller functions). Routes connect URLs to controllers.
