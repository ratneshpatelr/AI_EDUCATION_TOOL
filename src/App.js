import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import McqQuestions from "./components/McqQuestions";
import QuestionGenerator from "./components/QuestionGenrator";

function App() {
  return (
    <Router>
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mcq" element={<McqQuestions />} />
          <Route path="/question-generator" element={<QuestionGenerator />} />
        </Routes>
      </div>
      <Chatbot/>
    </Router>
  );
}

// Home component with navigation cards
function Home() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Quiz App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/mcq")}
          className="p-6 bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-600"
        >
          <h2 className="text-xl font-bold">MCQ Generator</h2>
          <p>Generate MCQ questions with options</p>
        </div>

        <div
          onClick={() => navigate("/question-generator")}
          className="p-6 bg-green-500 text-white rounded-lg shadow-lg cursor-pointer hover:bg-green-600"
        >
          <h2 className="text-xl font-bold">Question Generator</h2>
          <p>Generate only questions without options</p>
        </div>
      </div>
    </div>
  );
}

export default App;
