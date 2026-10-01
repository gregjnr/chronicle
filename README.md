# Chronicle — Modern Glassmorphism Blog Platform

A full-stack, responsive publishing platform crafted from scratch with a futuristic glassmorphic aesthetic. Features stateless JWT authentication, MongoDB & Mongoose data models, author CRUD operations, community discussions, tag/category filtering, and strict backend-enforced authorization rules.

![Chronicle Blog Platform](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

- **JWT Authentication & Authorization**:
  - Secure registration and login with bcrypt password hashing (10 salt rounds).
  - Stateless JSON Web Tokens (JWT) with automatic expiration and Bearer token headers.
  - Strict backend authorization checks: users can **only edit and delete their own posts and comments** (returns `403 Forbidden` if violated).
  - Instant 1-click demo login button for swift evaluation.

- **Post Management (Full CRUD)**:
  - **Create**: Write articles with title, category, tags, cover image URL, and markdown/formatted content.
  - **Read**: Public paginated feed (newest first, oldest, or most popular), search by keyword, category filtering, and single post view with author details and reading time estimates.
  - **Update**: Edit existing posts with pre-filled forms and live preview tabs.
  - **Delete**: Cascading deletion of posts and their associated comment threads with glass confirmation modals.

- **Community Discussions & Comments**:
  - Logged-in readers can leave comments on any article.
  - Comment author can delete their own comments.
  - Unauthenticated visitors see a prompt to log in to join the conversation.

- **Author Dashboard**:
  - Personal dashboard displaying the logged-in author's articles.
  - Real-time author metrics: Total Articles, Reader Views, and Discussion Comments.
  - In-dashboard quick search, direct view, edit, and deletion controls.

- **Glassmorphic Design System**:
  - Solid atmospheric dark background: `#0F0C29`.
  - Vibrant indigo primary accent (`#6C63FF`) & cyan highlights (`#00D9FF`).
  - Glass cards with `backdrop-filter: blur(16px)`, `rgba(255, 255, 255, 0.08)` surface, and subtle `0.15` alpha borders.
  - Responsive layout optimized for desktop, tablet, and mobile with custom scrollbars and smooth hover lift micro-interactions.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, tsx |
| **Database** | MongoDB with Mongoose (with embedded resilient store fallback) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS |

---

## 📁 Project Structure

```
├── /client                     # React Frontend
│   ├── .env.example            # Frontend environment variable template
│   └── src
│       ├── components          # Reusable UI (Navbar, Footer, PostCard, CommentSection, Modals)
│       ├── context             # AuthContext (user, token, login, register, logout)
│       ├── pages               # HomePage, PostDetailPage, CreatePostPage, EditPostPage, DashboardPage, LoginPage, RegisterPage, NotFoundPage
│       ├── services            # Axios HTTP client with Bearer token interceptor
│       ├── types.ts            # Client TypeScript interfaces
│       └── App.tsx             # Route definitions and layout
│
├── /server                     # Express Backend
│   ├── .env.example            # Backend environment variable template
│   ├── config
│   │   └── db.ts               # Mongoose MongoDB connection & resilient fallback
│   ├── controllers
│   │   ├── authController.ts   # Register, login, profile retrieval
│   │   ├── postController.ts   # Post CRUD, pagination, filtering, search, dashboard
│   │   └── commentController.ts# Comment retrieval, creation, author deletion
│   ├── middleware
│   │   ├── auth.ts             # JWT token verification & optional auth
│   │   └── errorHandler.ts     # Standardized JSON error response handler
│   ├── models
│   │   ├── User.ts             # Mongoose User Schema & password hashing
│   │   ├── Post.ts             # Mongoose Post Schema with categories and tags
│   │   └── Comment.ts          # Mongoose Comment Schema referencing post & user
│   ├── routes
│   │   ├── authRoutes.ts       # /api/auth routes
│   │   ├── postRoutes.ts       # /api/posts routes
│   │   └── commentRoutes.ts    # /api/comments routes
│   ├── services
│   │   └── dbStore.ts          # Zero-config memory/persistent collection service
│   ├── seed.ts                 # Initial demo articles, authors, and comments
│   └── types.ts                # Server TypeScript interfaces
│
├── server.ts                   # Unified Express + Vite dev server entry point
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 🚀 Quick Start & Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- (Optional) MongoDB instance or [MongoDB Atlas URI](https://www.mongodb.com/atlas)

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/blog-platform.git
cd blog-platform
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, configure your settings:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min32chars
JWT_EXPIRES_IN=7d
VITE_API_URL=/api
```
*(Note: If `MONGODB_URI` is not reachable, the system automatically initializes an embedded resilient database with rich sample data so you can test immediately without setting up local Mongo!)*

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🔑 Demo Credentials

To quickly explore the author features without registering:
- **Email**: `demo@chronicle.io`
- **Password**: `password123`
*(Or click the "1-Click Login" button directly on the Sign In page)*

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account | `{ name, email, password, bio?, avatar? }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT | `{ email, password }` |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile | Header: `Authorization: Bearer <token>` |
| `PUT` | `/api/auth/profile` | Private | Update user profile information | `{ name?, bio?, avatar? }` |

### Posts (`/api/posts`)
| Method | Endpoint | Access | Description | Query / Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | List published posts (paginated) | `?page=1&limit=6&search=term&category=Tech&sort=newest` |
| `GET` | `/api/posts/:id` | Public | Retrieve single post details | Increments view counter |
| `GET` | `/api/posts/user/me` | Private | Retrieve logged-in user's posts | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/posts/categories-tags` | Public | Distinct categories & popular tags | None |
| `POST` | `/api/posts` | Private | Create a new post | `{ title, content, category, tags, coverImage?, excerpt? }` |
| `PUT` | `/api/posts/:id` | Private (Author) | Update author's existing post | `{ title?, content?, category?, tags?, coverImage? }` |
| `DELETE` | `/api/posts/:id` | Private (Author) | Delete author's post & comments | Enforces author check (403 if unauthorized) |

### Comments (`/api/comments`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/comments/post/:postId` | Public | Get all comments for a post | None |
| `POST` | `/api/comments/post/:postId` | Private | Post a comment on an article | `{ content }` |
| `DELETE` | `/api/comments/:id` | Private (Author) | Delete comment | Enforces author check (403 if unauthorized) |

---

## 🛡️ Security & Authorization Principles

1. **No Client-Only Trust**: Authorization is never merely "hiding buttons in the React UI". Even if a malicious user manually triggers `PUT /api/posts/:id` or `DELETE /api/posts/:id`, the Express backend verifies the user ID from the decoded JWT against the record's author in the database. If they don't match, a `403 Forbidden` response is returned.
2. **Password Salting**: Passwords are never stored as plain text. Bcrypt hashes each password with a cryptographic salt.
3. **Stateless Scalability**: Authentication uses signed JWT tokens, allowing the API to scale across multiple instances without server-side session stores.

---

## 📄 License
This project is licensed under the Apache 2.0 License.
