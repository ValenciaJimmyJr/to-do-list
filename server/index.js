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

// --- REGISTER ---
// --- REGISTER ---
app.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if username exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // insert user
    const result = await pool.query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING id, name, username",
      [name, username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// --- LOGIN ---
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = userQuery.rows[0];

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Return basic info for frontend
    res.json({ id: user.id, name: user.name, username: user.username });
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

// ----------------- TEST -----------------
app.get("/", (req, res) => res.send("Server is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));