/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage chatbox visibility

  // Chatbase Embed Component
  const ChatbaseEmbed = () => {
    return (
      <div>
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/UWT4FFOWUZGicp9odjPvp"
          width="100%"
          style={{ height: '400px', width: '100%', backgroundColor: 'white', border: 'none' }}
          title="Euphoria Chatbot"
        ></iframe>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chat Icon to Toggle Chatbox */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-all"
        >
          <img
            src={assets.chatbot} // Replace with your chatbot icon path
            alt="Chat Icon"
            className="w-6 h-6"
          />
        </button>
      )}

      {/* Chatbox Popup */}
      {isOpen && (
        <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chatbox Header with Close Button */}
          <div className="flex justify-between items-center bg-pink-600 text-white p-3">
            <h3 className="text-lg font-semibold">Euphoria Chatbot</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-pink-600 rounded-full transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Chatbase Embed iframe */}
          <ChatbaseEmbed />
        </div>
      )}
    </div>
  );
};

export default Chatbot;