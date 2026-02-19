import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("Pending");

  const load = async () => {
    const res = await fetch(`${API}/items/${id}`);
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!desc.trim()) return;
    await fetch(`${API}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ list_id: id, description: desc, status }),
    });
    setDesc(""); setStatus("Pending"); load();
  };

  const del = async (itemId) => {
    await fetch(`${API}/items/${itemId}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate("/home")} className="mb-4 border px-4 py-2 rounded">← Back</button>

      <div className="flex gap-2 mb-4 max-w-md">
        <input className="flex-1 border px-3 py-2 rounded" value={desc} placeholder="New item" onChange={e => setDesc(e.target.value)} />
        <select className="px-3 py-2 border rounded" value={status} onChange={e => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>Done</option>
        </select>
        <button onClick={add} className="border px-4 py-2 rounded bg-gray-900 text-white">Add</button>
      </div>

      <div className="space-y-2 max-w-md">
        {items.map(i => (
          <div key={i.id} className="border p-3 rounded flex justify-between hover:bg-gray-100">
            <span>{i.description} ({i.status})</span>
            <button onClick={() => del(i.id)} className="text-red-600 text-sm underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListItem;
