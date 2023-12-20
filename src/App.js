import React, { useState, useEffect } from "react";
import "./App.css";
import examsData from './questions.json';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    setExams(examsData);
  }, []);

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const goToMainMenu = () => {
    setSelectedExam(null);
    setShowResults(false);
  };

  const startExam = (exam) => {
    setSelectedExam(exam);
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    setUserAnswers([]);
  };

  const repeatExam = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    setUserAnswers([]);
  };

  const optionClicked = (isCorrect, optionId) => {
    const newUserAnswers = [...userAnswers, { questionId: currentQuestion, selectedOptionId: optionId }];
    setUserAnswers(newUserAnswers);

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

  const chooseAnotherExam = () => {
    setSelectedExam(null);
  };

  const renderQuestionCard = () => {
    const question = selectedExam.questions[currentQuestion];
    const shuffledOptions = shuffleArray([...question.options]);

    return (
      <div className="question-card">
        <h2>Pregunta: {currentQuestion + 1} / {selectedExam.questions.length}</h2>
        <h3 className="question-text">{question.text}</h3>
        {question.questionURL && <img src={question.questionURL} alt="Question" />}
        <ul>
          {shuffledOptions.map((option) => (
            <li key={option.id} onClick={() => optionClicked(option.isCorrect, option.id)}>
              {option.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="final-results">
        <h1>Resultado</h1>
        <h2>{score} de {selectedExam.questions.length} correctas - {(score / selectedExam.questions.length) * 100}%</h2>
        {userAnswers.map((answer) => {
          const question = selectedExam.questions[answer.questionId];
          const selectedOption = question.options.find(option => option.id === answer.selectedOptionId);
          const correctOption = question.options.find(option => option.isCorrect);
  
          if (!selectedOption.isCorrect) {
            return (
              <div key={answer.questionId}>
                <h4>{question.text}</h4>
                {question.questionURL && (
                  <img src={question.questionURL} alt="Pregunta" style={{ maxWidth: '100%' }} />
                )}
                <p>Tu respuesta: {selectedOption.text}</p>
                <p>Respuesta correcta: {correctOption.text}</p>
              </div>
            );
          }
          return null;
        })}
        <button onClick={repeatExam}>Repetir examen</button>
        <button onClick={chooseAnotherExam}>Elegir otro examen</button>
      </div>
    );
  };

  return (
    <div className="App">
      <h1 onClick={goToMainMenu} style={{ cursor: 'pointer' }}>
        Sistemas Distribuidos
      </h1>
      {selectedExam ? (
        showResults ? renderResults() : renderQuestionCard()
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
