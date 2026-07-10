# Capstone Airbnb

Monorepo with a separate **frontend** (React + Vite) and **backend** (Node + Express + SQLite), ready to deploy independently.

## Project structure

```
capstone-airbnb/
├── backend/          # Express API (deploy to Render, Railway, etc.)
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/           # React app (deploy to Vercel, Netlify, etc.)
│   ├── src/
│   └── public/
└── package.json        # Convenience scripts for local dev
```

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` and proxies `/api` to the backend.

### Or from the repo root

```bash
npm run install:all
npm run dev:backend   # terminal 1
npm run dev:frontend  # terminal 2
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5000`) |
| `JWT_SECRET` | Secret for auth tokens |
| `FRONTEND_URL` | Deployed frontend URL for CORS (e.g. `https://your-app.vercel.app`) |
| `DATABASE_PATH` | Optional SQLite file path |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL in production (e.g. `https://your-api.onrender.com`). Leave empty for local dev (Vite proxy handles `/api`). |

## Deployment

### Backend → Render / Railway

1. Create a new **Web Service**
2. Set **Root Directory** to `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add env vars: `JWT_SECRET`, `FRONTEND_URL`
6. Note your API URL (e.g. `https://capstone-airbnb.onrender.com`)

### Frontend → Vercel / Netlify

1. Create a new project
2. Set **Root Directory** to `frontend`
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Add env var: `VITE_API_URL=https://your-api.onrender.com`
6. Redeploy after the backend is live

### After deploying

1. Set `FRONTEND_URL` on the backend to your live frontend URL
2. Set `VITE_API_URL` on the frontend to your live backend URL
3. Redeploy both if needed

## API routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/users/register` | Register user/admin |
| POST | `/api/users/login` | Login |
| GET | `/api/accommodations` | List listings |
| GET/POST/PUT/DELETE | `/api/accommodations/:id` | Manage listings |
| GET/POST/DELETE | `/api/reservations` | Manage reservations |
