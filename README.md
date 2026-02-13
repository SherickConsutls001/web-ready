# TalentBridge - Freelance & Services Marketplace

A modern freelance marketplace platform built with React and FastAPI.

## Project Structure

```
/
├── frontend/          # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # FastAPI backend application
│   ├── server.py
│   └── requirements.txt
└── render.yaml        # Render deployment config
```

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## Deployment

### Vercel (Frontend Only)
1. Import the `frontend` folder to Vercel
2. Set environment variable: `REACT_APP_BACKEND_URL` = your backend URL
3. Deploy

### Render (Full Stack)
1. Connect your GitHub repo to Render
2. Render will auto-detect `render.yaml`
3. Set environment variables:
   - `MONGO_URL` - Your MongoDB connection string
   - `CORS_ORIGINS` - Your frontend URL

### Railway (Full Stack)
1. Create a new project in Railway
2. Add two services from the same repo:
   - **Backend**: Set root directory to `backend`
   - **Frontend**: Set root directory to `frontend`
3. Set environment variables:
   - Backend: `MONGO_URL`, `CORS_ORIGINS`, `JWT_SECRET`
   - Frontend: `REACT_APP_BACKEND_URL` = backend service URL

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://...
CORS_ORIGINS=https://your-frontend-url.com
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB
