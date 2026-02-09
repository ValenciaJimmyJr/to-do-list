import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load user & lists
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (!u) return navigate("/");
    setUser(u);
    loadLists(u.id);
  }, []);

  const loadLists = async (userId) => {
    const res = await fetch(`${API_URL}/list/${userId}`);
    setLists(await res.json());
  };

  // Add new list
  const addList = async () => {
    if (!newTitle.trim()) return;
    await fetch(`${API_URL}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, status: "Active", user_id: user.id }),
    });
    setNewTitle("");
    loadLists(user.id);
  };

  // Start editing a list
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  // Save edited list
  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    await fetch(`${API_URL}/list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });
    setEditingId(null);
    setEditingTitle("");
    loadLists(user.id);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // Delete list
  const deleteList = async (id) => {
    await fetch(`${API_URL}/list/${id}`, { method: "DELETE" });
    loadLists(user.id);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Welcome, {user.name}</h1>

      {/* Add new list */}
      <div className="flex justify-center gap-2 mb-6">
        <input
          className="px-3 py-2 rounded border"
          placeholder="New list title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={addList} className="bg-green-600 text-white px-4 rounded">
          Add List
        </button>
        <button onClick={logout} className="bg-red-500 text-white px-4 rounded">
          Logout
        </button>
      </div>

      {/* Lists */}
      <div className="grid gap-4 max-w-xl mx-auto">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            {/* List title or edit input */}
            {editingId === list.id ? (
              <input
                className="border px-2 py-1 rounded flex-1 mr-2"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />
            ) : (
              <div
                onClick={() => navigate(`/list/${list.id}`)}
                className="cursor-pointer font-semibold hover:text-blue-600 flex-1"
              >
                {list.title}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              {editingId === list.id ? (
                <>
                  <button
                    onClick={() => saveEdit(list.id)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button onClick={cancelEdit} className="text-gray-600 text-sm">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(list.id, list.title)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
