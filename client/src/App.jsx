import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setAlert("⚠️ Invalid username or password.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setAlert(`Login Successful`);

    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Please Login 
        </h1>

        {alert && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              alert.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {alert}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>

       <p className="text-sm text-center text-gray-500 mt-6">
  Don’t have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
  >
    Register here
  </Link>
</p>

      </div>
    </div>
  );
}

export default App;
