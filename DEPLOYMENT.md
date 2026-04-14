# WriteSpace Blog — Deployment Guide

## Overview

WriteSpace Blog is a static single-page application (SPA) built with React 18 and Vite. This document covers deployment to **Vercel**, including configuration, build settings, and CI/CD integration with GitHub.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Configuration](#build-configuration)
3. [Vercel Deployment](#vercel-deployment)
4. [vercel.json SPA Rewrite Configuration](#verceljson-spa-rewrite-configuration)
5. [Environment Setup](#environment-setup)
6. [CI/CD with GitHub Integration](#cicd-with-github-integration)
7. [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A [Vercel](https://vercel.com) account
- A GitHub repository containing the WriteSpace Blog source code

---

## Build Configuration

WriteSpace Blog uses Vite as its build tool. The production build is generated with:

```bash
npm run build
```

This compiles the application and outputs static assets to the **`dist`** directory.

| Setting          | Value           |
| ---------------- | --------------- |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |
| Dev Command      | `npm run dev`   |

To verify the build locally before deploying:

```bash
npm run build
npx vite preview
```

---

## Vercel Deployment

### Step 1 — Import Project

1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New… → Project"**.
3. Select **"Import Git Repository"** and choose the WriteSpace Blog repository from GitHub.

### Step 2 — Configure Build Settings

Vercel typically auto-detects Vite projects. Confirm the following settings on the configuration screen:

| Field            | Value           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |

### Step 3 — Deploy

Click **"Deploy"**. Vercel will install dependencies, run the build, and publish the site. The first deployment usually completes in under two minutes.

---

## vercel.json SPA Rewrite Configuration

Because WriteSpace Blog is a single-page application using client-side routing, all routes must resolve to `index.html`. Create a **`vercel.json`** file in the project root with the following content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### What this does

- Any request that does not match a static file in `dist` is rewritten to `/index.html`.
- This ensures that deep links (e.g., `/blog/my-post`, `/about`) are handled by React Router on the client side instead of returning a 404 from the server.

> **Note:** Place `vercel.json` at the repository root (next to `package.json`), **not** inside the `dist` folder.

---

## Environment Setup

WriteSpace Blog is a fully static front-end application. **No environment variables are required** for deployment.

- There are no server-side secrets or API keys needed at build time.
- There are no `VITE_*` environment variables consumed by the application.

If future features require environment variables (e.g., a CMS API endpoint), add them in the Vercel dashboard under **Settings → Environment Variables** using the `VITE_` prefix so Vite exposes them to the client bundle:

```
VITE_API_URL=https://api.example.com
```

These values are embedded at build time and are **not** secret — they will be visible in the client bundle.

---

## CI/CD with GitHub Integration

Vercel provides first-class GitHub integration that enables automatic deployments on every push.

### Automatic Deployments

Once the GitHub repository is connected to Vercel:

| Trigger                              | Deployment Type     | URL                                      |
| ------------------------------------ | ------------------- | ---------------------------------------- |
| Push to `main` (or default branch)   | **Production**      | `https://your-project.vercel.app`        |
| Push to any other branch             | **Preview**         | Unique preview URL per commit            |
| Pull request opened / updated        | **Preview**         | Preview URL posted as a PR comment       |

### Branch Protection Recommendations

- Require pull requests before merging to `main`.
- Use Vercel's preview deployments to visually verify changes before merging.
- Vercel automatically adds a **deployment status check** to pull requests — you can make this a required check in GitHub branch protection rules.

### Configuring the GitHub Integration

1. In the Vercel dashboard, go to **Settings → Git**.
2. Confirm the **Production Branch** is set to `main`.
3. Optionally configure **Ignored Build Step** if you want to skip deployments for changes that don't affect the front-end (e.g., documentation-only commits):
   ```bash
   git diff --quiet HEAD^ HEAD -- src/ public/ index.html package.json vite.config.js
   ```

### Deployment Notifications

Vercel can notify your team of deployment status via:

- GitHub commit status checks (enabled by default)
- Slack integration (configure in Vercel dashboard → Integrations)
- Webhooks (configure in Vercel dashboard → Settings → Webhooks)

---

## Manual Deployment via Vercel CLI

For cases where you need to deploy outside of the GitHub integration:

### Install the Vercel CLI

```bash
npm install -g vercel
```

### Authenticate

```bash
vercel login
```

### Deploy a Preview

```bash
vercel
```

### Deploy to Production

```bash
vercel --prod
```

### One-Command Build and Deploy

```bash
npm run build && vercel --prod --prebuilt
```

> When using `--prebuilt`, ensure you run `vercel build` instead of `npm run build` so that the `.vercel/output` directory is created in the format Vercel expects.

---

## Troubleshooting

### 404 on page refresh

**Cause:** The SPA rewrite is not configured.

**Fix:** Ensure `vercel.json` exists at the project root with the rewrite rule described above.

### Build fails with "command not found: vite"

**Cause:** Dependencies were not installed before the build step.

**Fix:** Confirm the Install Command is set to `npm install` in Vercel project settings.

### Blank page after deployment

**Cause:** The `base` path in `vite.config.js` may be misconfigured.

**Fix:** Ensure `vite.config.js` does **not** set a `base` path (or sets it to `'/'`):

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Preview deployments not appearing on pull requests

**Cause:** The GitHub integration may not have the correct permissions.

**Fix:** In GitHub, go to **Settings → Integrations → Vercel** and ensure the integration has access to the repository.

---

## Summary

| Item                  | Value / Action                                    |
| --------------------- | ------------------------------------------------- |
| Build Command         | `npm run build`                                   |
| Output Directory      | `dist`                                            |
| SPA Rewrites          | `vercel.json` with `/(.*) → /index.html`          |
| Environment Variables | None required                                     |
| Production Deploys    | Automatic on push to `main` via GitHub integration |
| Preview Deploys       | Automatic on pull requests and feature branches    |