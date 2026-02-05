import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/"); // redirect to login if not logged in
      return;
    }
    setUser(currentUser);

    // Load all lists or create one list with id = 1
    let allLists = JSON.parse(localStorage.getItem("lists")) || {};
    if (!allLists[1]) {
      allLists[1] = []; // initialize the first list
      localStorage.setItem("lists", JSON.stringify(allLists));
    }
    setLists(allLists);
  }, [navigate]);

  if (!user) return null; // wait until useEffect runs

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

      <h2 className="text-xl font-semibold mb-4">Lists:</h2>

      <div className="grid grid-cols-1 gap-4">
        {lists[1] && (
          <div
            onClick={() => navigate(`/list/1`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:bg-blue-100 transition text-center font-medium"
          >
            List 1 ({lists[1].length} items)
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
