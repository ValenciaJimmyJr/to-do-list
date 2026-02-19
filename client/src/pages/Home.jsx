import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!token) navigate("/");
    else loadLists();
  }, []);

  const loadLists = async () => {
    const res = await fetch(`${API}/lists`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLists(data);
  };

  const addList = async () => {
    if (!title.trim()) return;

    await fetch(`${API}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    loadLists();
  };

  const deleteList = async (id) => {
    await fetch(`${API}/lists/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadLists();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      
      {/* WHITE CARD CONTAINER */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-gray-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome, {user?.name}
          </h1>

          <button
            onClick={logout}
            className="border border-black px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

        {/* ADD LIST */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-400 px-3 py-2 rounded"
            placeholder="New list..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addList}
            className="border border-black px-4 rounded hover:bg-gray-100"
          >
            Add
          </button>
        </div>

        {/* LISTS */}
        <div className="space-y-3">
          {lists.map((list) => (
            <div
              key={list.id}
              className="border border-gray-400 p-3 rounded flex justify-between items-center hover:bg-gray-50"
            >
              <span
                onClick={() => navigate(`/list/${list.id}`)}
                className="cursor-pointer font-medium"
              >
                {list.title}
              </span>

              <button
                onClick={() => deleteList(list.id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          ))}

          {lists.length === 0 && (
            <p className="text-gray-500 text-center">
              No lists yet. Add your first one.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
