import express from "express";
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= AUTH MIDDLEWARE ================= */

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

/* ================= AUTH ================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name)
      return res.status(400).json({ error: "All fields required" });

    const existing = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, name) VALUES ($1,$2,$3) RETURNING id, username, name",
      [username, hashedPassword, name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (!result.rows.length)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LISTS (PROTECTED) ================= */

app.get("/lists", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lists WHERE user_id=$1 ORDER BY id DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/lists", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    const result = await pool.query(
      "INSERT INTO lists (title, user_id) VALUES ($1,$2) RETURNING *",
      [title, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/lists/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM lists WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= ITEMS (PROTECTED) ================= */

app.get("/items/:listId", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM items WHERE list_id=$1",
      [req.params.listId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/items", authenticateToken, async (req, res) => {
  try {
    const { list_id, description } = req.body;

    const result = await pool.query(
      "INSERT INTO items (list_id, description) VALUES ($1,$2) RETURNING *",
      [list_id, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { description, status } = req.body;

    await pool.query(
      "UPDATE items SET description=$1, status=$2 WHERE id=$3",
      [description, status, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/items/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM items WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
