import React from "react";
import { useState } from "react";
import "./Game.scss";

const questions = [
  {
    title: 'React - это ... ?',
    variants: ['библиотека', 'фреймворк', 'приложение'],
    correct: 0,
  },
  {
    title: 'Компонент - это ... ',
    variants: ['приложение', 'часть приложения или страницы', 'то, что я не знаю что такое'],
    correct: 1,
  },
  {
    title: 'Что такое JSX?',
    variants: [
      'Это простой HTML',
      'Это функция',
      'Это тот же HTML, но с возможностью выполнять JS-код',
    ],
    correct: 2,
  },
];

function Result({correct}) {
  return (
    <div className="result">
      <img src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png" />
      <h2>you got {correct} correct answers out of {questions.length}</h2>
      <a href="/">
        <button>Try again</button>
      </a>
    </div>
  );
}

function Hud({step, correct}) {
  const percentage = Math.round((step / questions.length) * 100);

  return (
    <div id="hud">
    <div id="hud-item">
      <p id="progressText" className="hud-prefix">
        Question {step} out of {questions.length}
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
  const [step, setStep] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [isCorrect, setIsCorrect] = React.useState(null);
  const [selectedVariant, setSelectedVariant] = React.useState(null);
  const question = questions[step];
 
  const onClickVariant = (index) => {
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

  return (
    step >= questions.length ? <Result correct={correct}/> :
    <div className="container">
      <div id="game" className="justify-center flex-column hidden">
        <Hud step={step} correct={correct}/>
        <Question question={question} onClickVariant={onClickVariant} isCorrect={isCorrect} selectedVariant={selectedVariant}/>
      </div>
    </div>
  );
}

export default App;