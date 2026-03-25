# Abdulla Hani — Portfolio

Full-stack portfolio with **HTML / CSS / JS** frontend and **Node.js + Express** backend connected to **Neon PostgreSQL**.

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html   ← Frontend HTML
│   ├── style.css    ← All styles
│   └── main.js      ← All frontend JavaScript
├── server.js        ← Node.js / Express backend
├── package.json
├── .env.example     ← Copy → .env and fill in
└── .gitignore
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your `.env` file
```bash
cp .env.example .env
```
Open `.env` and paste your **Neon connection string**:
```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
```

### 3. Run the server
```bash
# Development (auto-restarts on save)
npm run dev

# Production
npm start
```

Visit `http://localhost:3000` — the server serves your frontend AND handles API calls.

---

## 🗄️ Getting your Neon DATABASE_URL

1. Go to [neon.tech](https://neon.tech) → Create a free account
2. Create a new project
3. Go to **Connection Details** → copy the **Connection string**
4. Paste it into your `.env` as `DATABASE_URL`

The `feedback` table is created automatically on first server start. No manual SQL needed.

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/feedback` | Save a feedback entry to Neon |
| `GET`  | `/api/feedback` | List all entries (admin/debug) |

### POST body (JSON):
```json
{
  "name": "John",
  "email": "john@email.com",
  "message": "Great portfolio!"
}
```

---

## ☁️ Deploy to Vercel

Add a `vercel.json` (included in the zip) and:
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` in Vercel → Settings → Environment Variables
4. Deploy ✅
