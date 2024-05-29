import React from "react";
import { useState, useEffect } from "react";
import "./Game.scss";

function Result({correct, total}) {
  return (
    <div className="result">
      <img src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png" />
      <h2>you got {correct} correct answers out of {total}</h2>
      <a href="/">
        <button>Try again</button>
      </a>
    </div>
  );
}

function Hud({step, correct, total}) {
  const percentage = Math.round((step / total) * 100);

  return (
    <div id="hud">
    <div id="hud-item">
      <p id="progressText" className="hud-prefix">
        Question {step} out of {total}
      </p>
      <div id="progressBar">
        <div id="progressBarFull" style={{width: `${percentage}%`}} />
      </div>
    </div>
    <div id="hud-item">
      <p className="hud-prefix">
        Score
      </p>
      <h1 className="hud-main-text" id="score">
        {correct}
      </h1>
    </div>
  </div>
  );
}

function Question({ question, onClickVariant, isCorrect, selectedVariant }) {
  return (
    <>
      <h2 id="question">{question.title}</h2>
      <ul className="choices-container">
        {
          question.variants.map((variant, index) => (
            <li key={index} className={`choice-container choice-btn ${selectedVariant === index ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
              <p className="choice-prefix">{String.fromCharCode(65 + index)}</p>
              <p className="choice-text" onClick={() => onClickVariant(index)}>{variant}</p>
            </li>
          ))
        }
      </ul>
    </>
  );
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple')
      .then(response => response.json())
      .then(data => {
        if (data.results) {
          const formattedQuestions = data.results.map((item, index) => {
            const incorrectAnswersIndexes = item.incorrect_answers.length;
            const correctAnswerIndex = Math.floor(Math.random() * (incorrectAnswersIndexes + 1));
  
            let variants = [...item.incorrect_answers];
            variants.splice(correctAnswerIndex, 0, item.correct_answer);
  
            return {
              title: decodeURIComponent(encodeURIComponent(item.question)),
              variants: variants.map(variant => decodeURIComponent(encodeURIComponent(variant))),
              correct: correctAnswerIndex,
            };
          });
          setQuestions(formattedQuestions);
        }
      });
  }, []);

  const onClickVariant = (index) => {
    const question = questions[step];
    setSelectedVariant(index);
    if (index === question.correct) {
      setCorrect(correct + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setTimeout(() => {
      setStep(step + 1);
      setIsCorrect(null);
      setSelectedVariant(null);
    }, 1000);
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const question = questions[step];

  return (
    step >= questions.length ? <Result correct={correct} total={questions.length}/> :
    <div className="container">
      <div id="game" className="justify-center flex-column hidden">
        <Hud step={step} correct={correct} total={questions.length}/>
        <Question question={question} onClickVariant={onClickVariant} isCorrect={isCorrect} selectedVariant={selectedVariant}/>
      </div>
    </div>
  );
}

export default App;