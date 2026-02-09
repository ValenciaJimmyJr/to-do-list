import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- AUTH ---------- */
app.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username,password,name) VALUES ($1,$2,$3) RETURNING id,username,name",
      [username, hash, name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: user.id, name: user.name, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- LISTS ---------- */
app.get("/list/:userId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM lists WHERE user_id=$1",
    [req.params.userId]
  );
  res.json(result.rows);
});

app.post("/list", async (req, res) => {
  const { title, status, user_id } = req.body;

  const result = await pool.query(
    "INSERT INTO lists (title,status,user_id) VALUES ($1,$2,$3) RETURNING *",
    [title, status, user_id]
  );
  res.json(result.rows[0]);
});

/* ---------- ITEMS ---------- */
app.get("/items/:listId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM items WHERE list_id=$1",
    [req.params.listId]
  );
  res.json(result.rows);
});

app.post("/items", async (req, res) => {
  const { list_id, description, status } = req.body;

  const result = await pool.query(
    "INSERT INTO items (list_id,description,status) VALUES ($1,$2,$3) RETURNING *",
    [list_id, description, status]
  );
  res.json(result.rows[0]);
});

app.delete("/items/:id", async (req, res) => {
  await pool.query("DELETE FROM items WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* ---------- START ---------- */
app.listen(3001, async () => {
  const test = await pool.query("SELECT NOW()");
  console.log("Neon connected at:", test.rows[0].now);
  console.log("API running on http://localhost:3001");
});
