import React, { useState } from 'react';
import Chatbot from './Chatbot';
import './ChatbotToggle.css'; // Add a new CSS file for toggle animation
import robotIcon from '../images/robot.png'; // Import the robot image

const ChatbotToggle = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-toggle">
        <button onClick={toggleChatbot} className="toggle-button">
            <img src={robotIcon} alt="Chatbot" className="robot-logo"/>
        </button>
        <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'closed'}`}>
        {isChatbotOpen && <Chatbot onClose={toggleChatbot} />}
      </div>
    </div>
  );
};

export default ChatbotToggle;
