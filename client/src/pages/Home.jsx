import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow w-96 text-center">

        {/* BIG HEADER */}
        <div className="bg-blue-600 text-white py-6 rounded-t-xl">
          <h1 className="text-3xl font-bold">Lists</h1>
        </div>

        {/* LIST COLUMN */}
        <div className="flex flex-col items-center py-6 space-y-4">
          <Link
            to="/list"
            className="w-3/4 text-lg font-semibold text-blue-600 border border-blue-600 rounded-lg py-3 hover:bg-blue-50 transition"
          >
            List
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
