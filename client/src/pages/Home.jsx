import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    navigate("/"); // redirect to login if not logged in
    return null;
  }

  const allLists = JSON.parse(localStorage.getItem("lists")) || {};
if (!allLists[1]) {
  allLists[1] = []; // one list with id = 1
  localStorage.setItem("lists", JSON.stringify(allLists));
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
  onClick={() => navigate(`/list/1`)}
  className="cursor-pointer bg-white p-4 rounded-xl shadow hover:bg-blue-100 transition text-center font-medium"
>
  List 1 ({lists[1].length} items)
</div>

    </div>
  );
}

export default Home;
