import React, { useState, useEffect } from "react";
import "./App.css";
import examsData from './questions.json'; // Asegúrate de que la ruta sea correcta

function App() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    setExams(examsData);
  }, []);

  const startExam = (exam) => {
    setSelectedExam(exam);
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const optionClicked = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < selectedExam.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="App">
      <h1>USA Quiz 🇺🇸</h1>
      {selectedExam ? (
        showResults ? (
          <div className="final-results">
            <h1>Final Results</h1>
            <h2>
              {score} out of {selectedExam.questions.length} correct - (
              {(score / selectedExam.questions.length) * 100}%)
            </h2>
            <button onClick={() => setSelectedExam(null)}>Choose another exam</button>
          </div>
        ) : (
          <div className="question-card">
            <h2>
              Question: {currentQuestion + 1} out of {selectedExam.questions.length}
            </h2>
            <h3 className="question-text">
              {selectedExam.questions[currentQuestion].text}
            </h3>
            <ul>
              {selectedExam.questions[currentQuestion].options.map((option) => (
                <li key={option.id} onClick={() => optionClicked(option.isCorrect)}>
                  {option.text}
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        exams.map((exam, index) => (
          <button key={index} onClick={() => startExam(exam)}>
            {exam.examName}
          </button>
        ))
      )}
    </div>
  );
}

export default App;
