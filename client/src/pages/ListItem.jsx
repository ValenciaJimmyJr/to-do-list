import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ListItem() {
  const { id } = useParams(); // list ID
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemStatus, setNewItemStatus] = useState("Pending");
  const [editItemId, setEditItemId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");

  // Load items from localStorage
  useEffect(() => {
    const allLists = JSON.parse(localStorage.getItem("lists")) || {};
    if (!allLists[id]) {
      allLists[id] = [];
      localStorage.setItem("lists", JSON.stringify(allLists));
    }
    setItems(allLists[id]);
  }, [id]);

  // Save items to localStorage
  const saveToStorage = (updatedItems) => {
    const allLists = JSON.parse(localStorage.getItem("lists")) || {};
    allLists[id] = updatedItems;
    localStorage.setItem("lists", JSON.stringify(allLists));
  };

  // Add new item
  const handleAddItem = () => {
    if (!newItemDesc.trim()) return;

    const newItem = {
      id: Date.now(),
      list_id: id,
      item: newItemDesc,
      status: newItemStatus,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToStorage(updatedItems);
    setNewItemDesc("");
    setNewItemStatus("Pending");
  };

  // Delete item
  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  // Save edits
  const handleSave = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, item: editDesc, status: editStatus } : item
    );
    setItems(updatedItems);
    saveToStorage(updatedItems);
    setEditItemId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-3 rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">List {id}</h1>

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
        {items.length === 0 && (
          <p className="text-center text-gray-500 py-4">No items yet. Add one above!</p>
        )}

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
