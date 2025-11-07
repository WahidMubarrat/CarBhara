# CarBhara Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Cloudinary account (for image uploads)
- Render account (free tier available)

## Step 1: MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string (replace `<password>` with your actual password)

## Step 2: Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Deploy Backend on Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `WahidMubarrat/CarBhara`

2. **Configure Build Settings**
   - **Name**: `carbhara-backend` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carbhara?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy your backend URL (e.g., `https://carbhara-backend.onrender.com`)

## Step 4: Deploy Frontend on Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect the same repository: `WahidMubarrat/CarBhara`

2. **Configure Build Settings**
   - **Name**: `carbhara-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   VITE_API_URL=https://carbhara-backend.onrender.com
   ```
   (Use the backend URL you copied earlier)

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete (3-5 minutes)
   - Your frontend will be live at: `https://carbhara-frontend.onrender.com`

## Step 5: Update CORS (Important!)

After deploying, update your backend `server.js` CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://carbhara-frontend.onrender.com'  // Add your actual frontend URL
  ],
  credentials: true
}));
```

Commit and push this change - Render will auto-deploy.

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Try signing up with a new account
3. Upload a profile picture (tests Cloudinary)
4. Sign in
5. Test all features (add car, book car, etc.)

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend Issues
- Check browser console for errors
- Verify `VITE_API_URL` points to correct backend URL
- Clear browser cache and try again

### Database Connection Failed
- Double-check MongoDB connection string
- Ensure password has no special characters (or URL encode them)
- Verify network access in MongoDB Atlas

### Images Not Uploading
- Verify Cloudinary credentials in backend environment variables
- Check Cloudinary dashboard for upload attempts
- Review backend logs for Cloudinary errors

## Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds (cold start)
- 750 hours/month free (enough for one service 24/7)

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared resources
- No automatic backups

**Cloudinary Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- Good for testing and small projects

## Notes
- Backend URL format: `https://your-service-name.onrender.com`
- Always use HTTPS in production
- Keep your JWT_SECRET secure and never commit it to GitHub
- Consider using a custom domain for professional deployment
