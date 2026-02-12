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

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (!u) return navigate("/");
    setUser(u);
    loadLists(u.id);
  }, []);

  const loadLists = async (userId) => {
    const res = await fetch(`${API_URL}/list/${userId}`);
    const data = await res.json();
    setLists(data);
  };

  const addList = async () => {
    if (!newTitle.trim()) return;

    await fetch(`${API_URL}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        status: "Active",
        user_id: user.id,
      }),
    });

    setNewTitle("");
    loadLists(user.id);
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

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

  const deleteList = async (id) => {
    await fetch(`${API_URL}/list/${id}`, {
      method: "DELETE",
    });

    loadLists(user.id);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-100 p-6 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user.name}
        </h1>

        {/* Add List Button (Top Right) */}
        <div className="flex gap-2">
          <input
            className="px-3 py-2 rounded border"
            placeholder="New list title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            onClick={addList}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add List
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="grid gap-4 max-w-xl mx-auto">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
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

            <div className="flex gap-2">
              {editingId === list.id ? (
                <>
                  <button
                    onClick={() => saveEdit(list.id)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 text-sm"
                  >
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

      {/* Logout Bottom Left */}
      <button
        onClick={logout}
        className="fixed bottom-6 left-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
