# Backend Deployment (Render)

Deploy the API to [Render](https://render.com) from your GitHub repo.

## Before you start

You need:
- Your **frontend URL** (from Vercel/Netlify), e.g. `https://capstone-airbnb.vercel.app`
- This repo pushed to GitHub: `https://github.com/Dakalomafela/capstoneairbnb`

## Step 1 — Push latest code to GitHub

From the project root:

```bash
git add .
git commit -m "Organize backend for Render deployment"
git push origin main
```

## Step 2 — Create the Render service

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select repo: `Dakalomafela/capstoneairbnb`
4. Use these settings:

| Setting | Value |
|---------|-------|
| **Name** | `capstone-airbnb-api` (or any name) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

## Step 3 — Environment variables

In Render → your service → **Environment**, add:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | A long random string (e.g. `my-super-secret-jwt-key-2026`) |
| `FRONTEND_URL` | Your live frontend URL, e.g. `https://your-app.vercel.app` |
| `NODE_VERSION` | `20` |

Optional (recommended for keeping data between restarts):

| Key | Value |
|-----|-------|
| `DATABASE_PATH` | `/var/data/database.sqlite` |

If you use `DATABASE_PATH=/var/data/database.sqlite`, also add a **Disk** in Render:
- Mount path: `/var/data`
- Size: 1 GB (free tier)

## Step 4 — Deploy

Click **Create Web Service** (or **Manual Deploy** if updating).

When it’s live, your API URL will look like:

`https://capstone-airbnb-api.onrender.com`

Test it:
- `https://YOUR-API.onrender.com/` → should return `{ "message": "Airbnb Backend API is running", "status": "OK" }`
- `https://YOUR-API.onrender.com/api/health` → should return `{ "status": "OK" }`

## Step 5 — Connect frontend to backend

In **Vercel** (frontend project) → **Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com` |

Then **Redeploy** the frontend so the new env var is picked up.

## Step 6 — Seed sample data (optional)

After the backend is running, open Render → **Shell** and run:

```bash
npm run seed
```

This adds demo hotel listings to the database.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS errors in browser | Set `FRONTEND_URL` on Render to your exact Vercel URL (no trailing slash) |
| 502 / service not starting | Check Render **Logs**; ensure Root Directory is `backend` |
| Empty listings | Run `npm run seed` in Render Shell |
| Data lost after redeploy | Add a Render Disk and set `DATABASE_PATH=/var/data/database.sqlite` |
| Free tier sleeps | First request after ~15 min idle may take 30–60 seconds to wake up |

## Quick checklist

- [ ] Code pushed to GitHub
- [ ] Render web service created with Root Directory = `backend`
- [ ] `JWT_SECRET` and `FRONTEND_URL` set on Render
- [ ] Backend URL works in browser
- [ ] `VITE_API_URL` set on Vercel and frontend redeployed
- [ ] Login/signup and listings work on live site
