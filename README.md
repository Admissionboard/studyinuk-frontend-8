# StudyinUK Frontend

## Vercel Deployment Instructions

### 1. Prepare Repository
1. Upload this folder to a GitHub repository
2. Connect the repository to Vercel

### 2. Required Environment Variables
Set these in your Vercel dashboard:

**VITE_API_URL** (Required)
- Value: Your backend URL from Render deployment
- Format: `https://your-backend-service.onrender.com`
- Description: Points frontend to your backend API

**VITE_SUPABASE_URL** (Required)
- Location: Supabase Dashboard → Settings → API
- Format: `https://your-project-id.supabase.co`
- Description: Your Supabase project URL

**VITE_SUPABASE_ANON_KEY** (Required)
- Location: Supabase Dashboard → Settings → API → anon public
- Format: `eyJhbGciOiJIUzI1NiIsI...` (JWT token)
- Description: Client-side authentication key for Supabase

### 3. Deployment Process
1. Vercel will auto-detect the framework (React + Vite)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set the environment variables above
5. Deploy

### 4. Verification
After deployment, your frontend will be available at:
`https://your-app-name.vercel.app`

### Important Notes
- Frontend connects to backend via VITE_API_URL
- Uses Supabase for authentication
- Optimized build with code splitting
- Supports single-page app routing
- CORS configured for API communication

### Local Development
```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to your backend API.