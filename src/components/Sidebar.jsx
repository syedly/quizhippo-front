import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout-view/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      // Whether successful or not, clear local storage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      if (response.ok) {
        navigate("/login");
      } else {
        console.warn("Logout failed, but tokens cleared");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">QuizHippo</h2>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 p-4 space-y-4">
        <button
          onClick={() => navigate("/main")}
          className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/quizzes")}
          className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
        >
          My Quizzes
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
        >
          Profile
        </button>
      </div>

      {/* Logout Button at Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
