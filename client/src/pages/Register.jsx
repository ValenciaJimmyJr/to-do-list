import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);

  const handleRegister = async () => {
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "Registered successfully!" });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage({ type: "error", text: "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-96 p-8 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        {message && (
          <div className={`mb-4 p-2 text-sm rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have account? <Link to="/" className="text-gray-900 underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
