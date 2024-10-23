import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import './mentalbot.css';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA6206mZepQktTDaSI_x6-Y1LNvy9cqKHs";

// Keywords related to mental health and pandemic
const MENTAL_HEALTH_KEYWORDS = [
  'anxiety', 'stress', 'depression', 'worried', 'scared', 'lonely', 'alone',
  'isolated', 'sad', 'fear', 'panic', 'mood', 'feeling', 'emotions', 'emotional',
  'tired', 'exhausted', 'overwhelmed', 'crisis', 'help', 'suicide', 'therapy',
  'counseling', 'mental', 'health', 'pandemic', 'epidemic', 'covid', 'virus',
  'lockdown', 'quarantine', 'isolation', 'social distancing', 'vaccine',
  'mask', 'hospital', 'doctor', 'medical', 'medicine', 'treatment', 'cope',
  'coping', 'support', 'difficulty', 'challenging', 'struggle', 'struggling'
];

export default function MentalHealthBot() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const isRelatedToMentalHealth = (text) => {
    const lowercaseText = text.toLowerCase();
    return MENTAL_HEALTH_KEYWORDS.some(keyword =>
      lowercaseText.includes(keyword.toLowerCase())
    );
  };

  const chatWithGemini = async (userInput) => {
    if (!isRelatedToMentalHealth(userInput)) {
      return "I apologize, but I'm specifically designed to provide support for mental health and pandemic-related concerns. I cannot assist with other topics. Please feel free to ask me about managing stress, anxiety, emotional well-being, or coping with pandemic-related challenges.";
    }

    const prompt = `You are an AI mental health support assistant specifically focused on helping people cope with pandemic and epidemic-related stress and anxiety. 
    Only respond to queries related to mental health, emotional well-being, and pandemic-related concerns.
    If the query is not related to these topics, politely decline to answer.
    For mental health queries, provide supportive, empathetic responses while encouraging professional help when needed.
    Current query: `;

    const fullInput = prompt + userInput;

    const payload = {
      contents: [
        {
          parts: [{ text: fullInput }]
        }
      ]
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I could not generate a response. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: "user", content: userInput }]);
    setUserInput("");

    try {
      const response = await chatWithGemini(userInput);
      setConversation(prev => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setConversation(prev => [...prev, { role: "bot", content: "I apologize, but I'm having trouble connecting. Please try again." }]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="mental-app-container">
      <div className="mental-chat-area">
        <div className="mental-chat-container">
          <div className="mental-chat-header">
            <h1 className="mental-title">Pandemic Mental Health Support</h1>
            <p className="mental-header-subtitle">We're here to help you cope during these challenging times</p>
          </div>

          <div className="mental-chat-content">
            <div className="mental-messages-container">
              {conversation.length === 0 && (
                <div className="mental-welcome-message">
                  <h2 className="mental-welcome-title">Welcome to Your Safe Space</h2>
                  <p className="mental-welcome-text">I'm here to support you with mental health concerns and pandemic-related challenges.</p>
                  <ul className="mental-welcome-list">
                    <li className="mental-welcome-item">Share your feelings about isolation</li>
                    <li className="mental-welcome-item">Discuss anxiety about health</li>
                    <li className="mental-welcome-item">Get tips for staying mentally healthy</li>
                    <li className="mental-welcome-item">Find ways to cope with uncertainty</li>
                  </ul>
                  <p className="mental-welcome-note">Note: I can only assist with mental health and pandemic-related topics.</p>
                </div>
              )}
              {conversation.map((message, index) => (
                <div key={index} className={`mental-message mental-${message.role}`}>
                  <div className="mental-message-content">
                    <div className="mental-message-icon">
                      {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className="mental-message-text">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mental-message mental-bot">
                  <div className="mental-message-content">
                    <div className="mental-typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="mental-input-form">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Share your thoughts and feelings about mental health..."
                className="mental-input-field"
              />
              <button type="submit" className="mental-send-button" disabled={isLoading}>
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
