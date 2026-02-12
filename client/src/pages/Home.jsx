import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://to-do-list-2-pn3x.onrender.com";

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
      body: JSON.stringify({
        title,
        status: "active",
        user_id: user.id,
      }),
    });

    if (res.ok) {
      setTitle("");
      setShowInput(false);
      loadLists();
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
    <div className="min-h-screen bg-black text-white relative p-8">

      {/* ADD LIST BUTTON - TOP RIGHT */}
      <button
        onClick={() => setShowInput(!showInput)}
        className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-lg"
      >
        + Add List
      </button>

      <h1 className="text-3xl font-bold text-blue-500 mb-8">
        Welcome, {user?.name}
      </h1>

      {/* ADD INPUT */}
      {showInput && (
        <div className="flex gap-2 mb-6 max-w-md">
          <input
            className="flex-1 px-3 py-2 rounded bg-white text-black"
            placeholder="List title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addList}
            className="bg-blue-600 hover:bg-blue-700 px-4 rounded"
          >
            Save
          </button>
        </div>
      )}

      {/* LISTS */}
      <div className="space-y-4 max-w-xl">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white text-black p-4 rounded-xl flex justify-between items-center shadow-md"
          >
            <span className="font-semibold">{list.title}</span>

            <div className="flex gap-4">
              <button
                onClick={() => updateList(list.id)}
                className="text-blue-600 font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => deleteList(list.id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOGOUT BUTTON - BOTTOM LEFT */}
      <button
        onClick={logout}
        className="absolute bottom-6 left-6 bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
      >
        Logout
      </button>

    </div>
  );
}

export default Home;
