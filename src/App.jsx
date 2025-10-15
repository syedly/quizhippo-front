// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import AllQuizzes from "./pages/AllQuizes";
import ExplorePage from "./pages/ExplorePage";
import ServerPage from "./pages/ServerPage";
import ServerDetailPage from "./pages/ServerDetailPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import QuizResultPage from "./pages/QuizResultPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quizzes" element={<AllQuizzes />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/server" element={<ServerPage />} />
        <Route path="/servers/:serverId" element={<ServerDetailPage />} />
        <Route path="/quizzes/:quizId" element={<QuizDetailPage />} />
        <Route path="/quiz-result/:attemptId" element={<QuizResultPage />} />
      </Routes>
    </Router>
  );
}
