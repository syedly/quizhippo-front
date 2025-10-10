import Sidebar from "../components/Sidebar";

export default function MainPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          You are logged in successfully.
        </p>
      </div>
    </div>
  );
}
