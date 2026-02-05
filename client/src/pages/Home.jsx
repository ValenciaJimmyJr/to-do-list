import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    navigate("/"); // redirect to login if not logged in
    return null;
  }

  // Load all lists from localStorage or create some sample ones
  const allLists = JSON.parse(localStorage.getItem("lists")) || {};
  const listKeys = Object.keys(allLists);
  if (listKeys.length === 0) {
    // initialize 3 sample lists if none exist
    const sampleLists = {
      1: [],
      2: [],
      3: [],
    };
    localStorage.setItem("lists", JSON.stringify(sampleLists));
  }

  const lists = JSON.parse(localStorage.getItem("lists"));

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

      <h2 className="text-xl font-semibold mb-4">Your Lists:</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(lists).map((listId) => (
          <div
            key={listId}
            onClick={() => navigate(`/list/${listId}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:bg-blue-100 transition text-center font-medium"
          >
            List {listId} ({lists[listId].length} items)
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
