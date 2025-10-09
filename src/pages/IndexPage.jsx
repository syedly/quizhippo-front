import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          Welcome to Quiz App
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Test your knowledge with fun and interactive quizzes!
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 font-medium"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
