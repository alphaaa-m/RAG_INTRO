# Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

- [x] Remove server-related code (FastAPI, FAISS)
- [x] Build JSON vector store
- [x] Configure serverless API route
- [x] Set up environment variables
- [x] Test locally

## 📦 Files Ready for Deployment

### Core Application
- `pages/index.js` - Chat UI
- `pages/api/chat.js` - Serverless API endpoint
- `public/vector_store.json` - Embedded CV data (35 chunks)

### Configuration
- `package.json` - Node.js dependencies
- `next.config.js` - Next.js config
- `vercel.json` - Vercel deployment settings
- `.gitignore` - Ignore patterns

### Data & Scripts
- `data/cv.txt` - CV content
- `data/journey.txt` - Background story
- `scripts/build_json_store.py` - Vector store builder

## 🚀 Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Initialize Git Repository**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Add environment variable:
     - Name: `GROQ_API_KEY`
     - Value: `xyz`
   - Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add secret when prompted:
# GROQ_API_KEY=your_groq_api_key_here

# Deploy to production
vercel --prod
```

## 🔧 Post-Deployment

1. **Test the deployed app**
   - Open your Vercel URL
   - Ask test questions
   - Verify responses

2. **Update CV data** (when needed)
   - Edit `data/cv.txt`
   - Run `npm run build-vector-store`
   - Commit and push changes
   - Vercel will auto-deploy

## 📊 What Was Removed

- `api_server.py` - FastAPI Python server
- `test_rag.py` - Local testing script
- `main.py` - Placeholder file
- `vector_store/` - FAISS binary files
- `scripts/build_vector_store.py` - Old FAISS builder
- Server dependencies (fastapi, uvicorn, faiss-cpu, etc.)

## 🎯 What Remains

**Serverless Only:**
- Next.js pages and API routes
- JSON-based vector store
- Xenova Transformers (runs in Node.js)
- Groq SDK for LLM

**Python (Build-time only):**
- `scripts/build_json_store.py` - For rebuilding vector store
- Dependencies in `requirements.txt` - Only for script

## ⚡ Performance Notes

- Cold start: 2-3 seconds (first request)
- Warm start: 500ms-1s
- Embedding model: ~100MB (cached after first load)
- Vector search: In-memory JSON (~150KB)

## 🔐 Security

- Never commit `.env.local` to Git
- Keep Groq API key in Vercel environment variables
- API key is server-side only (not exposed to client)

## 🆘 Troubleshooting

### If deployment fails:

1. **Check build logs** in Vercel dashboard
2. **Verify `public/vector_store.json` exists**
3. **Ensure `GROQ_API_KEY` is set** in Vercel
4. **Check Node.js version** (should be 18+)

### If API returns errors:

1. **Check Function Logs** in Vercel
2. **Verify vector store file** is served correctly
3. **Test API key** with curl/Postman
4. **Check cold boot timeout** (increase if needed)

---

**Ready to deploy! 🚀**
