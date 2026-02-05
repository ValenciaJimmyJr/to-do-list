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
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Home</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1 items-center justify-center px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
          Welcome, {user?.fullName}!
        </h2>

        <button
          onClick={() => navigate("/list/1")}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Open List
        </button>
      </main>
    </div>
  );
}

export default Home;
