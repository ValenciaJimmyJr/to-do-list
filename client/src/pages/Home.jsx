import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [list, setList] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (!u) return navigate("/");
    setUser(u);
    loadList(u.id);
  }, []);

  const loadList = async (userId) => {
    const res = await fetch(`${API_URL}/list/${userId}`);
    const data = await res.json();

    if (data.length === 0) {
      const create = await fetch(`${API_URL}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My List", status: "Active", user_id: userId }),
      });
      setList(await create.json());
    } else setList(data[0]);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user || !list) return null;

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome, {user.name}</h1>
      <button onClick={logout} className="mb-6 bg-red-500 text-white px-4 py-2 rounded">Logout</button>

      <div onClick={() => navigate(`/list/${list.id}`)}
        className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-blue-50 text-center">
        {list.title}
      </div>
    </div>
  );
}

export default Home;
