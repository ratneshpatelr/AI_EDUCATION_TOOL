import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import McqQuestions from "./components/McqQuestions";
import QuestionGenerator from "./components/QuestionGenrator";

function App() {
  return (
    <Router>
      <div className="app-container">
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

export default App;
