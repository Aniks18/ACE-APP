import React, { useState } from 'react';
import Chatbot from './Chatbot';
import './ChatbotToggle.css'; // Add a new CSS file for toggle animation

const ChatbotToggle = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-toggle">
      <button onClick={toggleChatbot} className="toggle-button">
        💬 Chat with us
      </button>
      <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'closed'}`}>
        {isChatbotOpen && <Chatbot onClose={toggleChatbot} />}
      </div>
    </div>
  );
};

export default ChatbotToggle;
