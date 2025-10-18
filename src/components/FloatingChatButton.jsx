import React, { useState } from "react";
import "../css/FloatingChatButton.css";
import axios from "axios";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 How can I help you today?", sender: "bot", time: "12:00 PM" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // shows "bot is typing..." while waiting

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // ✅ Send message to Django backend
      const response = await axios.post("https://quizhippo.pythonanywhere.com/api/chat/", { query });

      const botMessage = {
        id: Date.now(),
        text: response.data.response || "I received your message.",
        sender: "bot",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        id: Date.now(),
        text:
          error.response?.data?.error ||
          "⚠️ Oops! Something went wrong. Please try again later.",
        sender: "bot",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button onClick={toggleChat} className="chat-button">
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Overlay */}
      {isOpen && <div className="chat-overlay" onClick={toggleChat}></div>}

      {/* Chat Container */}
      <div className={`chat-container ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-icon">💬</div>
            <div>
              <h3>Quiz Support</h3>
              <p>Online now</p>
            </div>
          </div>
          <button className="close-btn" onClick={toggleChat}>
            ✖
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Show typing indicator while waiting for backend */}
          {isTyping && (
            <div className="chat-message bot">
              <div className="message-bubble typing">
                <p>Bot is typing...</p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} className="send-btn">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
