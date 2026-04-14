# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

- **Public Landing Page**: Welcome page showcasing published blog posts accessible to all visitors without authentication (SCRUM-16568)
- **Authentication System**: Complete login and registration flow with JWT-based session management (SCRUM-16569)
  - User registration with email, username, and password
  - User login with credential validation
  - Protected route handling with automatic redirect to login
  - Persistent session via token storage
- **Role-Based Access Control**: Two-tier permission system with User and Admin roles (SCRUM-16569)
  - Users can create, read, update, and delete their own blog posts
  - Admins have full access to all posts and user management features
  - Route guards enforcing role-based permissions
- **Blog CRUD with Ownership**: Full create, read, update, and delete operations for blog posts (SCRUM-16568)
  - Rich text content support for blog post creation
  - Post ownership enforcement ensuring users can only edit/delete their own posts
  - Public post listing with individual post detail views
  - Post metadata including author, creation date, and last updated timestamp
- **Admin Dashboard**: Dedicated administration panel for platform management (SCRUM-16570)
  - Overview statistics for total users, posts, and activity
  - Ability to manage and moderate all blog posts across the platform
- **User Management**: Admin tools for managing registered users (SCRUM-16570)
  - View all registered users with their roles and status
  - Promote or demote user roles between User and Admin
  - Remove user accounts when necessary
- **Avatar System**: User profile avatars with automatic generation (SCRUM-16568)
  - Default avatar generation based on user initials
  - Avatar display in navigation, post cards, and user profiles
- **Responsive Tailwind UI**: Fully responsive interface built with Tailwind CSS (SCRUM-16568)
  - Mobile-first design with breakpoints for tablet and desktop
  - Dark mode support via Tailwind dark variant
  - Consistent design system with reusable component styling
  - Accessible navigation with mobile hamburger menu
- **Vercel SPA Deployment**: Production-ready single-page application deployment configuration (SCRUM-16570)
  - Vite build optimization for production bundles
  - SPA fallback routing via vercel.json configuration
  - Environment variable support for API endpoint configuration