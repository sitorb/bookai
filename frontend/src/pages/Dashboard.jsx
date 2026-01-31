import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📚 BookAI Dashboard</h1>
      <div className="space-y-4">
        <Link to="/recommend" className="block p-4 bg-white rounded shadow hover:bg-gray-50">
          🔮 Get Book Recommendations
        </Link>
        <Link to="/history" className="block p-4 bg-white rounded shadow hover:bg-gray-50">
          🕘 View Recommendation History
        </Link>
      </div>
    </div>
  );
}
