/*
 * Create a list that holds all of your cards
 */

const cards = [
    'fa-diamond','fa-diamond',
    'fa-paper-plane-o','fa-paper-plane-o',
    'fa-anchor','fa-anchor',
    'fa-bolt','fa-bolt',
    'fa-cube','fa-cube',
    'fa-leaf','fa-leaf',
    'fa-bicycle','fa-bicycle',
    'fa-bomb','fa-bomb'
];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * Initialization of common variables
 */

let timer = "";
let movesCounter = 0;
let starCount = 0;
let totalSeconds = 0;
const moves = document.querySelector(".moves");
const stars = document.querySelector(".stars");
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const close = document.getElementsByClassName("close")[0];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method
 *   - render the movesCounter to html
 *   - hide the Modal
 */

function initGame() {
  const getDeck = document.querySelector(".deck");
  let shuffleCards = [];
  shuffleCards = shuffle(cards);
  const appendLink = shuffleCards.map(function(card) {
    return `<li class="card">
    <i class='fa ${card}'></i>   
    </li>`;
  });
  getDeck.innerHTML = appendLink.join("");
  moves.innerHTML = movesCounter;
  modal.style.display = "none";
}
initGame();

/*
 *  EventListener for the Modal close button
 *   - display = "none" for the Modal
 *   - Calling resetValues() function which resets/restarts the cards.
 */

close.addEventListener("click", function() {
  modal.style.display = "none";
  resetValues();
});

/*
 * Event listener for a card. If a card is clicked
 *   - display the card's symbol
 *   - addition of the card to a *list* of "clicked" cards
 *   - add each card's HTML to the page
 *   - calls the startTimer function to start the timer. If a first card is clicked
 *   - checks the condition to prevent from clicking again.
 *   - 'matchCardCount' -- count the times of the matched cards. when the                 'matchCardCount' is equal the half of the cardsCount(cards.length/2), indicates all the cards are open.
 */

function clickCards() {
  let clickedCards = [];
  let matchCardCount = 0;
  let timerCheck = 0;
  const getCards = document.querySelectorAll(".card");
  getCards.forEach(function(card) {
    card.addEventListener("click", function(e) {
      timerCheck += 1;
      if (timerCheck == 1) {
        startTimer();
      }
      if (!card.classList.contains("open") && !card.classList.contains("show") &&
         !card.classList.contains("match")) 
      {
        clickedCards.push(card);
        card.classList.add("open", "show", "pointer");
        if (clickedCards.length == 2) {
          movesCounter += 1;
          if (clickedCards[0].firstElementChild.className ==
            e.target.firstElementChild.className) 
          {
            matchCardCount += 1;
            matchCards(clickedCards);
            clickedCards = [];
            if (matchCardCount == cards.length / 2) {
              gameOver();
            }
          } else {
            unMatchCards(clickedCards);
            clickedCards = [];
          }
          starRating(movesCounter);
        }
      }
    });
  });
}
clickCards();

/*
 * Start the timer
 * Store timer in a temporary variable
 */

function startTimer() {
  timer = setInterval(setTime, 1000);
}

/*
 * Call to create statistic text for modal
 * Render the modal contents
 * Stop timer from running
 */

function gameOver() {
  clearInterval(timer);
  modal.style.display = "block";
  const movesSpan = document.querySelector(".moves-no");
  const starsSpan = document.querySelector(".star-no");
  const timerSpan = document.querySelector(".timer-count");
  movesSpan.innerHTML = movesCounter;
  starsSpan.innerHTML = starCount;
  timerSpan.innerHTML = `${minutesLabel.textContent} min ${
    secondsLabel.textContent
  } secs`;
}

/*
 * Opens and shows the card, after the card matches by adding classes.
 */

function matchCards(clickedCards) {
  clickedCards[0].classList.add("match", "open", "show", "bounce-6");
  clickedCards[1].classList.add("match", "open", "show", "bounce-6");
}

/*
 * When card Unmatches, adds the class 'shake' to display shake effect.
 * Closes back the back,When card Unmatches by removing the classes.
 */

function unMatchCards(clickedCards) {
  clickedCards[0].classList.add("shake");
  clickedCards[1].classList.add("shake");
  setTimeout(function() {
    clickedCards.forEach(function(card) {
      card.classList.remove("open", "show", "pointer", "shake");
    });
  }, 400);
}

/*
 * Determine the star rating based on moves made
 * For less than 14 moves - star is 3
 * For less than 18 moves - star is 2
 * For more than 18 moves - star is 1
 */

function starRating(movesCounter) {
  if (movesCounter < 14) {
    starCount = 3;
  } else if (movesCounter < 18) {
    starCount = 2;
    stars.children[2].firstElementChild.className = "fa fa-star-o";
  } else {
    starCount = 1;
    stars.children[1].firstElementChild.className = "fa fa-star-o";
  }
  moves.innerHTML = movesCounter;
}

/*
 * Reset the cards as well as the values
 *   - display the card's symbol
 *   - resets the Timer
 *   - resets the Moves
 */

function resetValues() {
  const starchild = document.querySelectorAll(".stars li");
  starchild.forEach(function(star) {
    star.firstElementChild.className = "fa fa-star";
  });
  totalSeconds = 0;
  secondsLabel.innerHTML = "00";
  minutesLabel.innerHTML = "00";
  movesCounter = 0;
  initGame();
  clickCards();
  clearInterval(timer);
}

/*
 * Event listener to restart the cards. If a restart icon is clicked
 */

const restartCards = document.querySelector(".restart");
restartCards.addEventListener("click", function() {
  resetValues();
});

/*
 * Pre-increment seconds on every time function is called
 * Calculate minute and second and store in variables
 * Format time in 00:00 and set it in variable
 * Show final formatted time to time-counter on webpage
 */

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

/*
 * Pad the time in 00 format
 * Convert time value to string
 * If digit is less than 2, add 0 infront
 * @param  {type} value time value
 * @return {type} string expression of time value
 */

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

/*
 * Event - when "playAgain" is clicked
 * hide modal
 * Call to resetValues()
 */

const playAgain = document.querySelector(".play-again");
playAgain.addEventListener("click", function() {
  modal.style.display = "none";
  resetValues();
});