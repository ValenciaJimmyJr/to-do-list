import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/");
      return;
    }
    setUser(currentUser);

    // Create ONLY ONE list
    let allLists = JSON.parse(localStorage.getItem("lists")) || {};
    if (!allLists[1]) {
      allLists[1] = [];
      localStorage.setItem("lists", JSON.stringify(allLists));
    }

    setLists(allLists);
  }, [navigate]);

  if (!user || !lists) return null;

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
          List ({lists[1]?.length || 0} items)
        </div>
      </div>
    </div>
  );
}

export default Home;
