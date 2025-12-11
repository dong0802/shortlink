# ⚡ Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/shortlink-project)

## 🚀 Deployment Steps

### 1. Click "Deploy" button above or:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### 2. Set Environment Variables in Vercel Dashboard

Go to: **Settings → Environment Variables**

Add these variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `your_super_secret_jwt_key_change_this_in_production_12345` |
| `TELEGRAM_BOT_TOKEN` | `8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk` |
| `TELEGRAM_CHAT_ID` | Get from bot (see below) |
| `BASE_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |

### 3. Get Telegram Chat ID

1. Open Telegram → Search `@AptechShortLinkBot`
2. Send `/start`
3. Visit: `https://api.telegram.org/bot8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk/getUpdates`
4. Find `"chat":{"id":123456789}`
5. Copy the ID and add to Vercel

### 4. MongoDB Atlas Setup

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
3. Save

### 5. Redeploy

After adding environment variables:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

## 📚 Full Documentation

See [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md) for detailed instructions.
