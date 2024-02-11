import React, { useState } from "react";
import "./App.css";
import sistemasDistribuidos from './sistemasDistribuidos.json';
import sistemasInteligentes from './sistemasInteligentes.json';
import ingenieriaSoftwareII from './ingenieriaSoftwareII.json';
import arquitecturaComputadores from './arquitecturaComputadores.json';
import integracionDeSistemas from './integracionDeSistemas.json';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Mapeo de asignaturas a sus archivos JSON correspondientes
  const subjectToExams = {
    "Sistemas Distribuidos": sistemasDistribuidos,
    "Sistemas Inteligentes": sistemasInteligentes,
    "Ingeniería del Software II": ingenieriaSoftwareII,
    "Arquitectura de Computadores": arquitecturaComputadores,
    "Integración de Sistemas": integracionDeSistemas,
  };

  const chooseAnotherExam = () => {
    setSelectedExam(null);
    setShowResults(false);
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const startSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedExam(null);
  };

  const startExam = (exam) => {
    setSelectedExam(exam);
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

  const renderQuestionCard = () => {
    const question = selectedExam.questions[currentQuestion];
    const shuffledOptions = shuffleArray([...question.options]);

    return (
      <div className="question-card">
        <h2>Pregunta {currentQuestion + 1} de {selectedExam.questions.length}</h2>
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
        
        {selectedExam.questions.map((question, index) => {
          const userAnswer = userAnswers.find(answer => answer.questionId === index);
          const selectedOption = question.options.find(option => option.id === userAnswer?.selectedOptionId);
          const correctOption = question.options.find(option => option.isCorrect);
  
          // Mostrar solo si la respuesta es incorrecta
          if (userAnswer && !selectedOption.isCorrect) {
            return (
              <div key={index} className="question-review">
                <h3>{question.text}</h3>
                {question.questionURL && <img src={question.questionURL} alt="Question" />}
                <p>Tu respuesta: {selectedOption ? selectedOption.text : "No respondida"}</p>
                <p>Respuesta correcta: {correctOption.text}</p>
              </div>
            );
          }
          return null;
        })}
  
        <button onClick={() => startExam(selectedExam)}>Repetir examen</button>
        <button onClick={chooseAnotherExam}>Elegir otro examen</button>
      </div>
    );
  };

  const renderExamSelection = () => {
    const exams = subjectToExams[selectedSubject];
    return (
      <div>
        <h2>Exámenes de {selectedSubject}</h2>
        {exams.map((exam, index) => (
          <button key={index} onClick={() => startExam(exam)}>
            {exam.examName}
          </button>
        ))}
        <button onClick={() => setSelectedSubject(null)}>Elegir otra asignatura</button>
      </div>
    );
  };
  
  const renderSubjectSelection = () => {
    return (
      <div>
        <h2>Elige una asignatura:</h2>
        {Object.keys(subjectToExams).map((subject, index) => (
          <button key={index} onClick={() => startSubject(subject)}>
            {subject}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1 onClick={() => setSelectedSubject(null)} style={{ cursor: 'pointer' }}>
        Inicio
      </h1>
      {selectedSubject ? (
        selectedExam ? (
          showResults ? renderResults() : renderQuestionCard()
        ) : renderExamSelection()
      ) : renderSubjectSelection()}
    </div>
  );
}

export default App;
