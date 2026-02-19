import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [title, setTitle] = useState("");
  const [lists, setLists] = useState([]);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
    else loadLists();
  }, []);

  const loadLists = async () => {
    const res = await fetch(`${API}/list/${user.id}`);
    const data = await res.json();
    setLists(data);
  };

  const addList = async () => {
    if (!title.trim()) return;
    const res = await fetch(`${API}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status: "active", user_id: user.id }),
    });
    if (res.ok) {
      setTitle(""); setShowInput(false); loadLists();
    }
  };

  const updateList = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    await fetch(`${API}/list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    loadLists();
  };

  const deleteList = async (id) => {
    await fetch(`${API}/list/${id}`, { method: "DELETE" });
    loadLists();
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 relative">
      <button onClick={() => setShowInput(!showInput)} className="absolute top-6 right-6 border px-5 py-2 rounded">
        Add List
      </button>

      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name}</h1>

      {showInput && (
        <div className="flex gap-2 mb-6 max-w-md">
          <input
            className="flex-1 border px-3 py-2 rounded"
            placeholder="List title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addList} className="border px-4 rounded bg-gray-900 text-white">Save</button>
        </div>
      )}

      <div className="space-y-3 max-w-xl">
        {lists.map(list => (
          <div key={list.id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer">
            <span onClick={() => navigate(`/list/${list.id}`)} className="font-medium">{list.title}</span>
            <div className="flex gap-3">
              <button onClick={() => updateList(list.id)} className="text-sm underline">Edit</button>
              <button onClick={() => deleteList(list.id)} className="text-sm underline text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={logout} className="absolute bottom-6 left-6 border px-4 py-2 rounded">Logout</button>
    </div>
  );
}

export default Home;
