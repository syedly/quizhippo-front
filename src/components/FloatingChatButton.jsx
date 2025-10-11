import React, { useState } from "react";
import "../css/FloatingChatButton.css";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 How can I help you today?", sender: "bot", time: "12:00 PM" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! 😊 I'm here to help.",
          sender: "bot",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
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
