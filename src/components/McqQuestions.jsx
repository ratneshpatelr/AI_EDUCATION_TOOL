import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function McqQuestions() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [level, setLevel] = useState("Default");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;

  const generateQuestions = async () => {
    if (!topic || !numQuestions || level === "Default") {
      setErrorMessage("Please fill out all fields correctly.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setAnswers([]);

    const prompt = `Generate ${numQuestions} multiple-choice questions about the topic '${topic}' at '${level}' level. Each question should have one correct answer and 3 distractors. Format them as follows:
  
    Question: <question_text>
    a) <option1>
    b) <option2>
    c) <option3>
    d) <option4>
    Correct Answer: <correct_option_letter>
    `;

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
        console.error("API Error:", response.statusText);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data && data.candidates && data.candidates.length > 0) {
        const generatedText = data.candidates[0]?.content?.parts[0]?.text;

        if (generatedText) {
          const questionBlocks = generatedText
            .split(/Question:/)
            .filter((q) => q.trim() !== ""); // Split at "Question:" but keep valid ones

          const formattedQuestions = questionBlocks.map((block, idx) => {
            const lines = block
              .trim()
              .split("\n")
              .map((line) => line.trim());
            const questionText = lines[0]; // First line after split should be the question
            const options = {
              a: lines[1]?.replace(/^a\)\s*/, ""),
              b: lines[2]?.replace(/^b\)\s*/, ""),
              c: lines[3]?.replace(/^c\)\s*/, ""),
              d: lines[4]?.replace(/^d\)\s*/, ""),
            };
            const correctAnswer = lines[5]
              ?.replace("Correct Answer:", "")
              .trim();

            return {
              id: idx,
              question: questionText,
              options,
              correctAnswer,
            };
          });

          if (formattedQuestions.length > 0) {
            setQuestions(formattedQuestions);
          } else {
            setErrorMessage("No valid questions generated.");
          }
        } else {
          setErrorMessage("No questions generated.");
        }
      } else {
        setErrorMessage("Error: No valid response from Gemini.");
      }
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setErrorMessage("Error generating questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const answerIndex = updatedAnswers.findIndex(
        (answer) => answer.id === questionId
      );

      if (answerIndex !== -1) {
        updatedAnswers[answerIndex] = {
          id: questionId,
          answer: selectedOption,
        };
      } else {
        updatedAnswers.push({ id: questionId, answer: selectedOption });
      }

      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const allAnswered = answers.length === questions.length;
    if (allAnswered) {
      setIsSubmitting(true); // Show loading state

      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMessage("Test submitted successfully!");
      }, 3000);
    } else {
      setErrorMessage("Please answer all questions before submitting.");
    }
  };
  return (
    <div className="w-full max-w-3xl mx-auto  p-8 rounded-xl shadow-xl mt-16">
      <button
        className="absolute top-6 right-6 text-white hover:text-gray-200"
        onClick={() => setQuestions([])}
      >
        <FaTimes size={22} />
      </button>

      <h1 className="text-3xl font-extrabold text-center  mb-8">
        Interactive Question Generator
      </h1>
      <div className="space-y-5">
        <div className="flex flex-col">
          <label htmlFor="topic" className="text-white text-lg font-medium">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-4 mt-2 rounded-lg shadow-md border-none outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter topic"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="numQuestions"
            className="text-white text-lg font-medium"
          >
            Number of Questions
          </label>
          <input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || "")}
            className="p-4 mt-2 rounded-lg shadow-md border-none outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter number of questions"
            min="1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="level" className="text-white text-lg font-medium">
            Difficulty Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="p-4 mt-2 rounded-lg shadow-md border-none outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Default" disabled>
              Select Difficulty Level
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={generateQuestions}
          disabled={isLoading}
          className={`w-full p-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-8 space-y-6">
          {questions.map((question, idx) => (
            <div
              key={question.id}
              className="p-4 bg-white shadow-md rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {idx + 1}. {question.question}{" "}
                {/* Make sure question is bold and has correct index */}
              </h3>
              <div className="space-y-2">
                {Object.entries(question.options).map(([key, option]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 cursor-pointer bg-gray-100 p-2 rounded-md"
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, key)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full p-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
          
        </div>
      )}
       {errorMessage && (
        <div className="text-center text-red-400 mb-4">{errorMessage}</div>
      )}

    </div>
  );
}
