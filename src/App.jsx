import React, { useState } from "react";
import "./style.css";
import { FaArrowRight, FaArrowLeft, FaRandom, FaCheckCircle, FaTimesCircle, FaEye, FaPlus } from "react-icons/fa";

const flashcardsData = [
  { question: "Who is known as the father of computers?", answer: "Charles Babbage", category: "Easy" },
  { question: "What does CPU stand for?", answer: "Central Processing Unit", category: "Easy" },
  { question: "Which programming language is known as the mother of all languages?", answer: "C", category: "Medium" },
  { question: "What does HTML stand for?", answer: "HyperText Markup Language", category: "Medium" },
  { question: "What is the full form of HTTP?", answer: "HyperText Transfer Protocol", category: "Medium" },
  { question: "Who invented the World Wide Web (WWW)?", answer: "Tim Berners-Lee", category: "Easy" },
  { question: "What does RAM stand for?", answer: "Random Access Memory", category: "Medium" },
  { question: "Which company developed the Java programming language?", answer: "Sun Microsystems", category: "Hard" },
  { question: "What is the primary function of an operating system?", answer: "Manage hardware and software resources", category: "Hard" },
  { question: "Which data structure follows the LIFO principle?", answer: "Stack", category: "Hard" }
];

function App() {
  const [flashcards, setFlashcards] = useState([...flashcardsData]);
  const [masteredCards, setMasteredCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const handleNext = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlipped(false);
    setUserInput("");
    setFeedback(null); // Reset feedback
  };

  const handleBack = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
    setUserInput("");
    setFeedback(null); // Reset feedback
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setUserInput("");
    setFeedback(null); // Reset feedback
  };

  const checkAnswer = () => {
    const correctAnswer = flashcards[currentIndex].answer.toLowerCase();
    const userAnswer = userInput.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      setFeedback("correct");
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > longestStreak) {
          setLongestStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setFeedback("incorrect");
      setCurrentStreak(0);
    }
  };

  const markAsMastered = () => {
    if (flashcards.length === 0) return;
    const masteredCard = flashcards[currentIndex];
    if (!masteredCards.some((card) => card.question === masteredCard.question)) {
      setMasteredCards([...masteredCards, masteredCard]);
    }
  };

  const showMasteredQuestions = () => {
    if (masteredCards.length === 0) {
      alert("No mastered questions yet!");
      return;
    }

    const popup = window.open("", "_blank", "width=500,height=500,scrollbars=yes");

    if (popup) {
      popup.document.write(`
        <html>
        <head>
          <title>Mastered Questions</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            h2 {
              color: #333;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              font-size: 1.1rem;
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            button {
              background: black;
              color: white;
              border: none;
              padding: 10px 15px;
              font-size: 1rem;
              cursor: pointer;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <h2>Mastered Questions</h2>
          <ul>
            ${masteredCards.map((card) => `<li>${card.question}</li>`).join("")}
          </ul>
          <button onclick="window.close()">Close</button>
        </body>
        </html>
      `);
      popup.document.close();
    }
  };

  return (
    <div className="app">
      <h1>The Ultimate Computer Science Quiz!</h1>
      <p className="subtitle">Test your CS knowledge with these fun trivia questions!</p>
      <p className="card-count">Number of cards: {flashcards.length}</p>

      {/* Streak Counter */}
      <p className="streak">🔥 Current Streak: {currentStreak} | Best Streak: {longestStreak}</p>

      {/* Flashcard - Click to Flip */}
      {flashcards.length > 0 && (
        <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
          <div className={`flashcard ${flipped ? "flipped" : ""}`}>
            <div className="flashcard-front">
              <p>{flashcards[currentIndex]?.question}</p>
            </div>
            <div className="flashcard-back">
              <p>{flashcards[currentIndex]?.answer}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Input & Submit Button */}
      <div className="answer-container">
        <input
          type="text"
          className={`answer-input ${feedback}`}
          placeholder="Enter your answer..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button className="submit-button" onClick={checkAnswer}>Submit</button>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <p className={`feedback-message ${feedback}`}>
          {feedback === "correct" ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
          {feedback === "correct" ? " Correct!" : " Incorrect, try again!"}
        </p>
      )}

      {/* Navigation, Shuffle & Mastered Buttons */}
      <div className="button-container">
        <button className="nav-button" onClick={handleBack}><FaArrowLeft /></button>
        <button className="nav-button shuffle-button" onClick={shuffleCards}><FaRandom /></button>
        <button className="nav-button" onClick={handleNext}><FaArrowRight /></button>
      </div>

      {/* Mastered Buttons */}
      <div className="mastered-button-container">
        <button className="submit-button" onClick={markAsMastered}><FaPlus /> Add to Mastered</button>
        <button className="submit-button" onClick={showMasteredQuestions}><FaEye /> Show Mastered</button>
      </div>
    </div>
  );
}

export default App;
