<!-- import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

// Replace with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyDG68AVXmVPa0Hb8_CzZC1xfGZGNWvMJLM"; // Ensure this is the correct key.

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch AI response from Gemini API
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const fetchGeminiResponse = async (userMessage) => {
    const maxRetries = 5;  // Max retries before giving up
    let retryDelay = 1000; // Initial delay in ms (1 second)
  
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "contents": [{
              "parts": [{"text": userMessage}]
            }]
          }),
        });
  
        const data = await response.json();
        console.log("API Response:", data);
  
        // Check if response is valid and contains a candidate response
        if (response.ok && data && data.candidates && data.candidates.length > 0) {
          // Extract the AI response text from the response structure
          const aiText = data.candidates[0]?.content?.parts[0]?.text;
          return aiText || "Sorry, there was an issue generating a response.";  // Fallback if no text found
        } else {
          console.error("API Error: No valid response", data);
          return "Sorry, there was an issue generating a response.";
        }
      } catch (error) {
        console.error("Error fetching from Gemini API:", error);
  
        // Retry on rate-limited error (code 429)
        if (error.code === 429) {
          console.log(`Rate limit exceeded. Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
          retryDelay *= 2; // Exponential backoff: increase the delay for each retry
        } else {
          return "Error: Unable to reach the AI service.";
        }
      }
    }
  
    return "Error: Could not get a response after retries.";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Fetch the AI response from Gemini API
    const aiMessageText = await fetchGeminiResponse(input);

    // Add AI response to the chat
    const aiMessage = { text: aiMessageText, sender: "ai" };
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-1/2 h-[70vh] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold p-4 border-b-4 border-blue-400 text-center">
          CHATBOT
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900 text-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 max-w-xs rounded-lg border ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-700 text-white self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t flex items-center bg-gray-200">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
            placeholder="Type here to ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} -->
