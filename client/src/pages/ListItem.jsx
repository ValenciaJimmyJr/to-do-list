import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_NEON_URL;
const API_KEY = import.meta.env.VITE_NEON_KEY;

function ListItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const listId = parseInt(id);

  const [items, setItems] = useState([]);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemStatus, setNewItemStatus] = useState("Pending");
  const [editItemId, setEditItemId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");

  const fetchItems = () => {
    fetch(`${API_URL}/items?list_id=eq.${listId}`, {
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, [listId]);

  const handleAddItem = async () => {
    if (!newItemDesc.trim()) return;

    const newItem = {
      list_id: listId,
      item: newItemDesc,
      status: newItemStatus,
    };

    try {
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      setNewItemDesc("");
      setNewItemStatus("Pending");
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`${API_URL}/items?id=eq.${itemId}`, {
        method: "DELETE",
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (itemId) => {
    try {
      const res = await fetch(`${API_URL}/items?id=eq.${itemId}`, {
        method: "PATCH",
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: editDesc, status: editStatus }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      setEditItemId(null);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-3 rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        List {listId}
      </h1>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newItemDesc}
          onChange={(e) => setNewItemDesc(e.target.value)}
          placeholder="New item description"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newItemStatus}
          onChange={(e) => setNewItemStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Pending</option>
          <option>Done</option>
        </select>
        <button
          onClick={handleAddItem}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-center text-gray-500 py-4">No items yet. Add one above!</p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 bg-white p-4 rounded-lg shadow items-center">
            <div className="col-span-1 text-center">{item.id}</div>
            <div className="col-span-2 text-center">{item.list_id}</div>
            <div className="col-span-5">
              {editItemId === item.id ? (
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                item.item
              )}
            </div>
            <div className="col-span-2 text-center">
              {editItemId === item.id ? (
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>Done</option>
                </select>
              ) : (
                item.status
              )}
            </div>
            <div className="col-span-2 flex justify-center gap-2">
              {editItemId === item.id ? (
                <>
                  <button
                    onClick={() => handleSave(item.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditItemId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditItemId(item.id);
                      setEditDesc(item.item);
                      setEditStatus(item.status);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
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

export default ListItem;
