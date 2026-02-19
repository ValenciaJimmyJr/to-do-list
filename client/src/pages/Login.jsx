import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("currentUser", JSON.stringify(data));
      navigate("/home");
    } else {
      setMessage({ type: "error", text: data.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-96 p-8 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {message && (
          <div className={`mb-4 p-2 text-sm rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          No account? <Link to="/register" className="text-gray-900 underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
