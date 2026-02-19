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
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } else {
      setMessage({ type: "error", text: data.error });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>

        {message && (
          <div className="mb-4 p-2 text-sm rounded bg-red-100 text-red-600">
            {message.text}
          </div>
        )}

        <input
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          No account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
