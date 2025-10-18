import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import "../css/main.css";

export default function CreateQuiz() {
  const [quizType, setQuizType] = useState("MIX");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("1");
  const [language, setLanguage] = useState("English");
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [pdf, setPdf] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [loading, setLoading] = useState(false);
  const [quizResponse, setQuizResponse] = useState(null);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setQuizResponse(null);

      const formData = new FormData();
      formData.append("quiz_type", quizType);
      formData.append("quiz_count", numQuestions);
      formData.append("difficulty", difficulty);
      formData.append("language", language);

      // Handle the active tab
      if (activeTab === "text" && text) formData.append("input_text", text);
      if (activeTab === "prompt" && prompt) formData.append("input_prompt", prompt);
      if (activeTab === "url" && url) formData.append("input_url", url);
      if (activeTab === "pdf" && pdf) formData.append("input_pdf", pdf);

      // 🔐 Include token if logged in
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "https://quizhippo.pythonanywhere.com/api/generate-quiz/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      setQuizResponse(response.data);
      console.log("✅ Quiz Generated:", response.data);
    } catch (error) {
      console.error("❌ Error generating quiz:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="mainWrapper">
        <div className="content">
          <h1 className="title">Create a Quiz</h1>

          {/* ---------- Tabs Section ---------- */}
          <div className="tabsContainer">
            <div className="tabsWrapper">
              <button
                className={`tab ${activeTab === "text" ? "tabActive" : "tabInactive"}`}
                onClick={() => setActiveTab("text")}
              >
                Enter Text
              </button>
              <button
                className={`tab ${activeTab === "prompt" ? "tabActive" : "tabInactive"}`}
                onClick={() => setActiveTab("prompt")}
              >
                Enter Prompt
              </button>
              <button
                className={`tab ${activeTab === "url" ? "tabActive" : "tabInactive"}`}
                onClick={() => setActiveTab("url")}
              >
                Provide URL
              </button>
              <button
                className={`tab ${activeTab === "pdf" ? "tabActive" : "tabInactive"}`}
                onClick={() => setActiveTab("pdf")}
              >
                Upload PDF
              </button>
            </div>

            <div className="tabContent">
              {activeTab === "text" && (
                <div>
                  <label className="label">Text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="textarea"
                    placeholder="Enter your text here..."
                  />
                </div>
              )}

              {activeTab === "prompt" && (
                <div>
                  <label className="label">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="textarea"
                    placeholder="Enter your prompt here..."
                  />
                </div>
              )}

              {activeTab === "url" && (
                <div>
                  <label className="label">URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {activeTab === "pdf" && (
                <div>
                  <label className="label">Upload PDF</label>
                  <div className="uploadBox">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      style={{ display: "none" }}
                      id="pdfUpload"
                    />
                    <label htmlFor="pdfUpload" className="uploadText">
                      {pdf ? pdf.name : "Click to upload or drag and drop PDF"}
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---------- Quiz Settings ---------- */}
          <div className="settingsSection">
            <h2 className="settingsTitle">Quiz Settings</h2>

            <div className="grid">
              <div>
                <label className="label">Quiz Type</label>
                <div className="selectWrapper">
                  <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="select"
                  >
                    <option value="MIX">Mix</option>
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE-FALSE">True/False</option>
                    <option value="FILL-IN-THE-BLANKS">Fill in the blanks</option>
                    <option value="SHORT ANSWER">Short Question Answer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Number of Questions</label>
                <div className="selectWrapper">
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="select"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Difficulty</label>
                <div className="selectWrapper">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="select"
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Language</label>
                <div className="selectWrapper">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="select"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="buttonWrapper">
              <button className="button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Generating..." : "Create Quiz"}
              </button>
            </div>

            {/* ---------- Display Response ---------- */}
            {quizResponse && (
              <div style={{ marginTop: "40px", color: "white" }}>
                <h3>✅ Quiz Generated Successfully!</h3>
                <pre style={{ whiteSpace: "pre-wrap", background: "#1e293b", padding: "16px", borderRadius: "8px" }}>
                  {JSON.stringify(quizResponse.quiz, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingChatButton />
    </div>
  );
}
