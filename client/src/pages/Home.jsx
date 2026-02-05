import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    navigate("/"); // redirect to login if not logged in
    return null;
  }

  // Initialize the single list in localStorage if it doesn't exist
  const LIST_KEY = "myList";
  let list = JSON.parse(localStorage.getItem(LIST_KEY));
  if (!list) {
    list = [];
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  }

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome,
      </h1>

      <button
        onClick={logout}
        className="mb-6 bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-4">My List:</h2>

      <div
        onClick={() => navigate("/list")}
        className="cursor-pointer bg-white p-6 rounded-xl shadow hover:bg-blue-100 transition text-center font-medium text-lg"
      >
        My List ({list.length} items)
      </div>
    </div>
  );
}

export default Home;
