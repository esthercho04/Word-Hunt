const Duration = 30; // Game duration in seconds
const validWords = new Set(); // Dictionary of valid words
let score = 0;
let foundWords = [];
let isSelecting=false; //keeps tracks if user is holding down the mouse. 
let selected=[];//stores the id of the selected box.


// DOM Elements
const wordInput = document.getElementById("word-input");
const submitWordButton = document.getElementById("submit-word");
const scoreElement = document.getElementById("score");
// const foundWordsElement = document.getElementById("found-words");
const timerElement = document.getElementById("timer");

// Load Dictionary
fetch("words_alpha.txt")
  .then((response) => response.text())
  .then((data) => {
    const words = data.split("\n");
    for (const word of words) {
      validWords.add(word.trim().toLowerCase());
    }
    console.log("Dictionary loaded with", validWords.size, "words.");
  })
  .catch((error) => console.error("Error loading dictionary:", error));

// Function to draw a single box
function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className ="box";
  box.id =`box${row}${col}`;
  box.textContent=letter;

  //providing attributes to row and column.
  box.dataset.row=row;
  box.dataset.col=col;

  box.addEventListener("mousedown",startWord);
  box.addEventListener("mousemove",continueWord);
  box.addEventListener("mouseup",endWord);


  container.appendChild(box); // appendChild is used to append a node to the end of the list of children of a specified parent node.
  return box;
}

// Function to draw the grid
function drawGrid(container) {
  const grid = document.createElement("div"); // createElement creates a new div element.
  grid.className = "grid";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // Generates random letters for the grid.
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      drawBox(grid, i, j, randomLetter);
    }
  }

  container.appendChild(grid); // append the grid to the container
}

// Check if a word is valid
function isValid(word) {
  return validWords.has(word.toLowerCase());
}

// Submit a word
function submitWord() {
  const word = wordInput.value.trim().toUpperCase();
  if (!word) return;

  if (foundWords.includes(word)) {
    alert("You already found this word!");
  } else if (isValid(word)) {
    foundWords.push(word);
    score += word.length;
    scoreElement.textContent = score;
    // foundWordsElement.textContent = foundWords.join(", ");
    wordInput.value = "";
  } else {
    alert("Invalid word!");
  }
}

// Start the timer
function startTimer() {
//   let timeLeft = Duration;
//   timerElement.textContent = timeLeft;

//   const timer = setInterval(() => {
//     timeLeft--;
//     timerElement.textContent = timeLeft;

//     if (timeLeft <= 0) {
//       clearInterval(timer);
//       alert(`Time's up! Your final score is ${score}.`);
//     }
//   }, 1000);
    let sec = 30;
    const timerElement = document.getElementById("timer"); // Ensure this exists
    const timer = setInterval(() => {
        timerElement.textContent = `Timer:${sec}s`;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            alert("Time's up!");
        }
    }, 1000);
}


function startWord(event){
    isSelecting=true;
    selectedBoxes=[];
    selectBox(event.target);
}

function continueWord(event){
    if (isSelecting){

        selectBox(event.target);
    }
}

function endWord(){
    isSelecting=false;


    const word = selectedBoxes.map((boxId) => {
        const box = document.getElementById(boxId);
        return box ? box.textContent : "";
      }).join("");
    
      // Validate the word
      if (isValid(word)) {
        alert(`Valid word: ${word}`);
        // Add your scoring logic here
      } else {
        alert(`Invalid word: ${word}`);
      }
    
      // Clear selection visually
      clearSelection();
}

function selectBox(box) {
    if (box && !selectedBoxes.includes(box.id)) {
      selectedBoxes.push(box.id);
      box.classList.add("selected"); // Highlight the box
    }
  }
  
  function clearSelection() {
    selectedBoxes.forEach((boxId) => {
      const box = document.getElementById(boxId);
      if (box) {
        box.classList.remove("selected"); // Remove the highlight
      }
    });
    selectedBoxes = [];
  }



// Start the game
function startGame() {
  const container = document.querySelector(".game-container");
  container.innerHTML = ""; // Clear previous grid
  drawGrid(container);
  score = 0;
//   foundWords = [];
  scoreElement.textContent = score;
//   foundWordsElement.textContent = "";
  startTimer();
}

//start the timer by event listener.
//stackoverflow by user snow
document.querySelector(".grid").addEventListener("click", () => {
    if (!timerStarted) { //Start the timer only if it hasn't started yet
      timerStarted = true; //Prevent starting multiple timers
      interval = setInterval(myTimer, 1000); //Start the timer
    }
  });





// Initialize the game
function startup() {
    const container = document.querySelector(".game-container"); // Ensure this exists
    container.innerHTML = ""; // Clear previous content
    drawGrid(container); // Draw the grid inside the container
    startTimer();
}
  

// Event listeners
// submitWordButton.addEventListener("click", submitWord);
// wordInput.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") submitWord();
// });

// Start the game
startup();
