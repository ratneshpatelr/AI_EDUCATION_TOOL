import { useState } from "react";

export default function QuestionGenerator() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [level, setLevel] = useState("Default");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;

  const generateQuestions = async () => {
    if (!topic || !numQuestions || level === "Default") {
      setErrorMessage("Please fill out all fields correctly.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setQuestions([]);
    setSelectedQuestions([]);

    const prompt = `Generate ${numQuestions} short and clear questions related to '${topic}' at '${level}' level. Only return the questions without any options or answers.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        setErrorMessage("Failed to generate questions.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts[0]?.text;

      if (generatedText) {
        const generatedQuestions = generatedText.split("\n").filter(q => q.trim());
        setQuestions(generatedQuestions.map((q, index) => ({ id: index, text: q })));
      } else {
        setErrorMessage("No questions generated.");
      }
    } catch (error) {
      setErrorMessage("Error fetching from Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectQuestion = (id) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((qId) => qId !== id)
        : [...prevSelected, id]
    );
  };

  const showSelectedQuestions = () => {
    setQuestions(questions.filter((q) => selectedQuestions.includes(q.id)));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 rounded-xl shadow-xl mt-16">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        Teacher Question Generator
      </h1>

      <div className="space-y-5">
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded-lg shadow-md border outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Number of questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value) || "")}
          className="w-full p-3 rounded-lg shadow-md border outline-none focus:ring-2 focus:ring-blue-400"
          min="1"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-3 rounded-lg shadow-md border outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Default" disabled>Select Difficulty Level</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <button
        onClick={generateQuestions}
        disabled={isLoading}
        className="w-full mt-6 p-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
      >
        {isLoading ? "Generating..." : "Generate Questions"}
      </button>

      {errorMessage && <div className="text-center text-red-400 mt-4">{errorMessage}</div>}

      {questions.length > 0 && (
        <div className="mt-8 space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`p-4 border rounded-lg cursor-pointer shadow-md ${selectedQuestions.includes(question.id) ? "bg-blue-100" : "bg-white"}`}
              onClick={() => toggleSelectQuestion(question.id)}
            >
              {question.text}
            </div>
          ))}
        </div>
      )}

      {selectedQuestions.length > 0 && (
        <button
          onClick={showSelectedQuestions}
          className="w-full mt-6 p-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none"
        >
          Show Selected Questions
        </button>
      )}
    </div>
  );
}
