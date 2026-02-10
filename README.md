# CV Chatbot - Serverless RAG Application

Interactive chatbot powered by Retrieval-Augmented Generation (RAG), built with Next.js and deployable to Vercel.

## Features

- 💬 Interactive chat interface
- 🤖 AI-powered responses using Groq (Llama 3.1)
- 📚 Vector-based semantic search
- 🚀 100% Serverless architecture
- ⚡ Fast embedding with Xenova Transformers
- 🌐 Deploy to Vercel with one click

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **AI/LLM**: Groq API (Llama 3.1-8B)
- **Embeddings**: Xenova Transformers (all-MiniLM-L6-v2)
- **Vector Store**: JSON-based (serverless-friendly)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.13+ (for building vector store)
- Groq API key ([Get one here](https://console.groq.com))

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Vector Store

Process your CV data into embeddings:

```bash
npm run build-vector-store
```

Or run directly:

```bash
python scripts/build_json_store.py
```

This creates `public/vector_store.json` with embedded chunks from your CV.

### 3. Set Environment Variables

Create `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/rag-cv)

### Manual Deploy

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/rag-cv.git
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variable: `GROQ_API_KEY`
   - Click Deploy!

### Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

When prompted, add your `GROQ_API_KEY`.

## Project Structure

```
├── pages/
│   ├── index.js              # Chatbot UI
│   └── api/
│       └── chat.js           # Serverless API route
├── public/
│   └── vector_store.json     # Embedded CV data (35 chunks)
├── scripts/
│   └── build_json_store.py   # Vector store builder
├── data/
│   ├── cv.txt               # Your CV content
│   └── journey.txt          # Additional context
├── lib/
│   └── vectorSearch.js      # Vector similarity utilities
├── .env.local               # Environment variables (local)
├── next.config.js           # Next.js configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

## API

### POST `/api/chat`

**Request:**
```json
{
  "message": "What is your experience?"
}
```

**Response:**
```json
{
  "reply": "I have experience with..."
}
```

## Customization

### Update CV Data

1. Edit `data/cv.txt` and `data/journey.txt`
2. Rebuild vector store:
   ```bash
   npm run build-vector-store
   ```
3. Restart dev server (or redeploy to Vercel)

### Adjust Chunk Parameters

Edit `scripts/build_json_store.py`:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # Adjust chunk size
    chunk_overlap=50     # Adjust overlap
)
```

### Change AI Model

Edit `pages/api/chat.js`:

```javascript
const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",  // Try: llama-3.3-70b-versatile
  // ...
});
```

Available models: [Groq Models](https://console.groq.com/docs/models)

### Customize UI

Edit `pages/index.js` to modify:
- Colors and styling (see `styles` object)
- Suggestion questions
- Chat behavior

## How It Works

1. **User Question** → Frontend sends to `/api/chat`
2. **Query Embedding** → Xenova Transformers creates vector
3. **Similarity Search** → Finds top 4 relevant CV chunks using cosine similarity
4. **Context + LLM** → Groq generates answer with context
5. **Response** → User sees AI-generated reply

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes |

## Performance

- **Cold start**: ~2-3 seconds (first request)
- **Warm start**: ~500ms-1s
- **Embedding model**: Cached after first load
- **Vector store**: Load once, cache in memory

## Troubleshooting

### "Invalid API Key" Error

Make sure `GROQ_API_KEY` is set correctly in `.env.local` (local) or Vercel dashboard (production).

### "Vector store not found"

Run the build script:
```bash
python scripts/build_json_store.py
```

### Slow Response Times

- Cold starts are normal on Vercel's free tier
- Consider upgrading to Pro for faster edge functions
- First request loads the embedding model (~100MB)

## License

MIT

## Author

Muneeb Ashraf

---

**Built with ❤️ using Next.js, Groq, and Vercel**
