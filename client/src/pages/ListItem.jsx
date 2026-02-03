import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ListItem() {
  const { id } = useParams(); // list_id
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemStatus, setNewItemStatus] = useState("Pending");
  const [editItemId, setEditItemId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");

  // Fetch list and items
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/lists/${id}`);
        setList(res.data);
        setItems(res.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchList();
  }, [id]);

  // Add new item
  const handleAddItem = async () => {
    if (!newItemDesc.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3000/lists/${id}/items`, {
        item: newItemDesc,
        status: newItemStatus
      });
      setItems([...items, res.data]);
      setNewItemDesc("");
      setNewItemStatus("Pending");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/items/${itemId}`);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  // Save edits
  const handleSave = async (itemId) => {
    try {
      const res = await axios.put(`http://localhost:3000/items/${itemId}`, {
        item: editDesc,
        status: editStatus
      });
      setItems(items.map((item) =>
        item.id === itemId ? { ...item, item: editDesc, status: editStatus } : item
      ));
      setEditItemId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!list) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-3 rounded-lg text-lg font-medium transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">{list.list}</h1>

      {/* Add new item */}
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

      {/* Table Header */}
      <div className="grid grid-cols-12 bg-gray-200 p-3 rounded-t-lg font-semibold text-gray-700">
        <div className="col-span-1 text-center">ID</div>
        <div className="col-span-2 text-center">List ID</div>
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 bg-white p-4 rounded-lg shadow items-center"
          >
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
                    onClick={() => { setEditItemId(item.id); setEditDesc(item.item); setEditStatus(item.status); }}
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
