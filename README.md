# WriteSpace Blog

A modern, feature-rich blogging platform built with React and Vite. WriteSpace provides a clean, responsive interface for creating, reading, and managing blog posts with role-based access control and persistent local storage.

## Features

- **User Authentication** — Register, login, and logout with role-based access (admin, author, reader)
- **Blog Post Management** — Create, edit, delete, and view blog posts with rich content
- **Role-Based Access Control** — Different permissions for admins, authors, and readers
- **Responsive Design** — Fully responsive UI built with Tailwind CSS for all screen sizes
- **Dark Mode Support** — Toggle between light and dark themes
- **Search & Filter** — Search posts by title, content, or author; filter by category/tags
- **User Profiles** — View and edit user profile information
- **Persistent Storage** — All data persisted via localStorage (no backend required)
- **Markdown Support** — Write blog posts using Markdown formatting

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **PropTypes** | Runtime prop validation |
| **localStorage** | Client-side data persistence |

## Folder Structure

```
writespace-blog/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                  # Static assets (images, icons)
│   ├── components/
│   │   ├── common/              # Shared/reusable components (Button, Input, Modal)
│   │   ├── layout/              # Layout components (Header, Footer, Sidebar)
│   │   ├── posts/               # Post-related components (PostCard, PostList, PostForm)
│   │   └── auth/                # Auth components (LoginForm, RegisterForm)
│   ├── contexts/                # React context providers (AuthContext, ThemeContext)
│   ├── hooks/                   # Custom hooks (useAuth, usePosts, useLocalStorage)
│   ├── pages/                   # Route-level page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── CreatePostPage.jsx
│   │   ├── EditPostPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/                # Data access layer (postService, authService)
│   ├── utils/                   # Utility functions (formatDate, validators, slugify)
│   ├── App.jsx                  # Root component with router
│   ├── main.jsx                 # Entry point (renders App)
│   └── index.css                # Tailwind directives & global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace-blog

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Linting

```bash
npm run lint
```

## Build & Deployment

### Production Build

```bash
# Create an optimized production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

Alternatively, deploy via the Vercel CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

## localStorage Schema

All application data is persisted in the browser's `localStorage` under the following keys:

### `writespace_users`

```json
[
  {
    "id": "string (uuid)",
    "username": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "admin | author | reader",
    "displayName": "string",
    "bio": "string",
    "avatar": "string (URL)",
    "createdAt": "string (ISO 8601)"
  }
]
```

### `writespace_posts`

```json
[
  {
    "id": "string (uuid)",
    "title": "string",
    "slug": "string",
    "content": "string (Markdown)",
    "excerpt": "string",
    "coverImage": "string (URL)",
    "authorId": "string (uuid)",
    "category": "string",
    "tags": ["string"],
    "status": "draft | published",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

### `writespace_current_user`

```json
{
  "id": "string (uuid)",
  "username": "string",
  "email": "string",
  "role": "admin | author | reader",
  "displayName": "string"
}
```

### `writespace_theme`

```json
"light | dark"
```

## Route Map

| Route | Page Component | Auth Required | Allowed Roles |
|---|---|---|---|
| `/` | `HomePage` | No | All |
| `/login` | `LoginPage` | No (redirects if logged in) | All |
| `/register` | `RegisterPage` | No (redirects if logged in) | All |
| `/posts/:slug` | `PostDetailPage` | No | All |
| `/posts/create` | `CreatePostPage` | Yes | admin, author |
| `/posts/:slug/edit` | `EditPostPage` | Yes | admin, author (own posts) |
| `/profile` | `ProfilePage` | Yes | All |
| `/dashboard` | `DashboardPage` | Yes | admin, author |
| `*` | `NotFoundPage` | No | All |

## Role-Based Access Rules

### Reader
- View all published posts
- View own profile
- Edit own profile
- Register and log in

### Author
- All Reader permissions
- Create new blog posts
- Edit own posts (draft and published)
- Delete own posts
- Access the author dashboard (view own posts, stats)

### Admin
- All Author permissions
- Edit any post (regardless of author)
- Delete any post
- Manage users (change roles, delete accounts)
- Access the admin dashboard (all posts, all users, site stats)

## Environment Variables

Create a `.env` file in the project root if needed:

```env
VITE_APP_TITLE=WriteSpace
```

Access in code via `import.meta.env.VITE_APP_TITLE`.

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.