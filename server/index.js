// server/index.js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- AUTH ---------- */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (!result.rows.length || result.rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const result = await pool.query(
      "INSERT INTO users (username, password, name) VALUES ($1,$2,$3) RETURNING *",
      [username, password, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/list", async (req, res) => {
  try {
    const { title, status, user_id } = req.body;
    const result = await pool.query(
      `INSERT INTO list (id, title, status, user_id) 
       VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`,
      [title, status, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
/* ---------- LIST ---------- */

// ✅ GET all lists of a user
app.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      "SELECT * FROM list WHERE user_id=$1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ ADD new list
app.post("/list", async (req, res) => {
  try {
    const { title, status, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO list (id, title, status, user_id) 
       VALUES (gen_random_uuid(), $1, $2, $3) 
       RETURNING *`,
      [title, status || "Active", user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ UPDATE list title
app.patch("/list/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const result = await pool.query(
      "UPDATE list SET title=$1 WHERE id=$2 RETURNING *",
      [title, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ DELETE list
app.delete("/list/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM list WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ---------- ITEMS ---------- */
app.get("/items/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await pool.query(
      "SELECT * FROM items WHERE list_id=$1",
      [listId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/items", async (req, res) => {
  try {
    const { list_id, description, status } = req.body;
    const result = await pool.query(
      `INSERT INTO items (id, list_id, description, status) 
       VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`,
      [list_id, description, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/items/:id", async (req, res) => {
  try {
    const { description, status } = req.body;
    await pool.query(
      "UPDATE items SET description=$1, status=$2 WHERE id=$3",
      [description, status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM items WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

