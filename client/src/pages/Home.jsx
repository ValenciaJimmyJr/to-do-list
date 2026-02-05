import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_NEON_URL;
const API_KEY = import.meta.env.VITE_NEON_KEY;

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listsCount, setListsCount] = useState(0);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/");
      return;
    }
    setUser(currentUser);

    // Fetch lists count from Neon for this user
    fetch(`${API_URL}/list?user_id=eq.${currentUser.id}`, {
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setListsCount(data.length))
      .catch((err) => console.error(err));
  }, [navigate]);

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user.fullName}
      </h1>

      <button
        onClick={logout}
        className="mb-6 bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-4">My List</h2>

      <div className="grid grid-cols-1 gap-4">
        <div
          onClick={() => navigate("/list/1")}
          className="cursor-pointer bg-white p-6 rounded-xl shadow hover:bg-blue-100 transition text-center font-medium"
        >
          List ({listsCount} items)
        </div>
      </div>
    </div>
  );
}

export default Home;
