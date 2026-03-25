const express = require("express");
const { neon } = require("@neondatabase/serverless");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── Neon DB ──────────────────────────────────────────────
const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✅ Database ready");
}
initDB().catch(console.error);

// ─── Routes ──────────────────────────────────────────────

// POST /api/feedback — Submit feedback
app.post("/api/feedback", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await sql`
      INSERT INTO feedback (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;
    res.status(200).json({ message: "Message received — thank you!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error. Please try again." });
  }
});

// GET /api/feedback — Fetch all (admin/debug)
app.get("/api/feedback", async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM feedback ORDER BY created_at DESC`;
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch entries." });
  }
});

// Catch-all → serve index.html for SPA-style navigation
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
});
