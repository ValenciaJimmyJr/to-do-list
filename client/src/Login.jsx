import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_NEON_URL;
const API_KEY = import.meta.env.VITE_NEON_KEY;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch user from Neon
      const res = await fetch(`${API_URL}/users?username=eq.${username}`, {
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.length === 0) {
        setAlert("Invalid username or password");
        return;
      }

      const user = data[0];

      if (user.password !== password) {
        setAlert("Invalid username or password");
        return;
      }

      // Save user to localStorage for session
      localStorage.setItem("currentUser", JSON.stringify(user));
      setAlert("Login Successful");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      console.error(err);
      setAlert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Please Login
        </h1>

        {alert && (
          <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800">
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

export default Login;
