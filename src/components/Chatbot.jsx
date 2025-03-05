import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { FaRobot, FaTimes, FaRegTrashAlt } from "react-icons/fa";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;

  const fetchGeminiResponse = async (userMessage) => {
    const customResponses = {
      "who are you": "Hi! I'm an AI assistant by Ratnesh, I'm here to help you with anything you need.",
      "what can you do": "I can assist you with answering questions, providing information, or even help you with tasks like setting reminders or explaining complex topics. Just ask!",
      "how are you": "I'm just a program, but thanks for asking! How can I assist you today?",
      "help me": "Of course! What do you need help with? Just ask me anything.",
      "thank you": "You're very welcome! Let me know if you need anything else.",
      "goodbye": "Ratnesh is saying to you Goodbye! Feel free to reach out to me whenever you need assistance.",
      "who created you": "I was created by Ratnesh!, but my main job is to assist you. 😊",
      "what's your purpose": "My purpose is to make your life easier by providing useful information and helping you with any queries you have."
    };

    const normalizedMessage = userMessage.trim().toLowerCase();

    if (customResponses[normalizedMessage]) {
      return customResponses[normalizedMessage];
    }

    const maxRetries = 5;
    let retryDelay = 3000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (!GEMINI_API_KEY || !GEMINI_API_URL) {
          return "Error: Missing API Key or URL.";
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "contents": [{
              "parts": [{ "text": userMessage }]
            }]
          }),
        });

        if (!response.ok) {
          return "Error: Unable to reach the AI service.";
        }

        const data = await response.json();

        if (data && data.candidates && data.candidates.length > 0) {
          const aiText = data.candidates[0]?.content?.parts[0]?.text;
          return aiText || "Sorry, there was an issue generating a response.";
        } else {
          return "Sorry, there was an issue generating a response.";
        }
      } catch (error) {
        if (error.code === 429) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryDelay *= 2;
        } else {
          return "Error: Unable to reach the AI service.";
        }
      }
    }
    return "Error: Could not get a response after retries.";
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const aiMessageText = await fetchGeminiResponse(input);
    const aiMessage = { text: aiMessageText, sender: "ai" };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setIsLoading(true);
    setMessages([]);
  };

  return (
    <div >
      <button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-800 transition"
        onClick={toggleChat}
        style={{ fontSize: "24px" }}
      >
        <FaRobot />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-0 right-0 p-4 w-[600px] h-[600px] shadow-lg rounded-2xl flex flex-col transition-all">
          <div className="bg-gradient-to-r from-slate-800 to-gray-700 text-white text-xl font-bold p-4 flex justify-between items-center">
            <button className="text-white text-2xl p-2 hover:bg-gray-600 rounded-full" onClick={toggleChat}>
              <FaTimes />
            </button>
            <span className="flex-1 text-center relative">
              CHATBOT
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            </span>
            <button className="text-white text-2xl p-2 hover:bg-gray-600 rounded-full" onClick={handleClearChat}>
              <FaRegTrashAlt />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900 text-white">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 max-w-4xl rounded-lg border ${msg.sender === "user" ? "bg-blue-600 text-white self-end ml-auto w-2/6" : "bg-gray-700 text-white self-start mr-auto"}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="p-3 max-w-4xl rounded-lg bg-gray-600 text-white self-start mr-auto w-4/5">Please wait, generating data...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 flex items-center bg-slate-600 ">
            <input type="text" className="flex-1 p-2  rounded-lg outline-none focus:ring-2 focus:ring-blue-400 shadow-inner bg-slate-500" placeholder="Type here to ask something..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} disabled={isLoading} />
            <button className="ml-2 p-2 bg-slate-800 text-white rounded-lg hover:bg-blue-600 transition flex items-center" onClick={handleSendMessage} disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
