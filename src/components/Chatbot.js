// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { fetchGeminiAnswer } from './Gemini.js';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css'; // Add your styles here

const Chatbot = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(true); // Option to select mode
  const [chatMode, setChatMode] = useState(null); // "doctor" or "information"
  const messagesEndRef = useRef(null); // Reference to the end of the messages list

  // Automatically send a welcome message when the chatbot is loaded
  useEffect(() => {
    const welcomeMessage = {
      text: `**Welcome!** Please choose an option below:`,
      sender: 'bot',
    };
    setMessages([welcomeMessage]);
  }, []);

  // Function to scroll to the bottom of the chatbox
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle the message sending
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatMode) return; // Prevent sending messages if no mode is selected

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: 'user' },
    ]);

    try {
      const response = await fetchGeminiAnswer(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error fetching response.', sender: 'bot' },
      ]);
    }

    setInput(''); // Clear the input after sending the message
  };

  // Function to select a chat mode
  const selectMode = (mode) => {
    setChatMode(mode);
    setShowOptions(false);

    if (mode === 'doctor') {
      // Simulate assigning a doctor (to be replaced with real doctor selection)
      const randomDoctor = 'Dr. John Doe'; // This could be fetched from the JSON file
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You are now speaking to ${randomDoctor}. How can I assist you today?`, sender: 'bot' },
      ]);
    } else if (mode === 'information') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You selected **Search Information**. I'm here to assist you with disease information, symptoms, and treatment suggestions. Please ask me anything about a disease.`, sender: 'bot' }
      ]);
    }
  };

// Function to convert Markdown to WhatsApp friendly text
const convertMarkdownToWhatsAppFormat = (text) => {
    return text
      .replace(/## (.*?)\n/g, '*$1*:\n') // Convert ## Header to *Header*:
      .replace(/\*\*\*(.*?)\*\*\*/g, '**$1**') // Convert ***text*** to *text* for bold
      .replace(/\*\*(.*?)\*\*/g, '*$1*') // Convert **text** to *text* for bold
      .replace(/__(.*?)__/g, '*$1*') // Convert __text__ to *text* for bold
    //   .replace(/\*(.*?)\*/g, '_$1_'); // Convert *text* to _text_ for italic
  };
  
  // Function to share the entire conversation via WhatsApp
  const shareConversationOnWhatsApp = () => {
    const conversation = messages.map(msg => {
      const speaker = msg.sender === 'user' ? '*You*' : '*Bot*';
      const formattedText = convertMarkdownToWhatsAppFormat(msg.text);
      return `${speaker}: ${formattedText}`;
    }).join('\n\n');

    const url = `https://wa.me/?text=${encodeURIComponent(conversation)}%20Visit%20https://your-link-here.com`;
    window.open(url, '_blank');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Chatbot</h2>
        <button onClick={onClose}>X</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              // Render bot messages with Markdown
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text // Render user messages as plain text
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* This div marks the end of the chat */}
      </div>

      {showOptions && (
        <div className="options">
          <button className="option-button" onClick={() => selectMode('doctor')}>
            Speak to a Doctor
          </button>
          <button className="option-button" onClick={() => selectMode('information')}>
            Search Information
          </button>
        </div>
      )}

      {!showOptions && (
        <form onSubmit={sendMessage} className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            required
            disabled={chatMode === 'doctor'} // Disable input when in doctor mode until backend integration
          />
          <button type="submit" disabled={chatMode === 'doctor'}>
            Send
          </button>
        </form>
      )}

      {/* Share button to share the entire conversation */}
      <button className="share-conversation-button" onClick={shareConversationOnWhatsApp}>
        Share Conversation on Whatsapp
      </button>
    </div>
  );
};

export default Chatbot;
