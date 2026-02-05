import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.fullName}
      </h1>

      <button
        onClick={() => navigate("/list/1")}
        className="mb-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Open List
      </button>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
