// D-ice: Dice game logic

// Generate random numbers for both dice
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

// Set dice images
var diceImage1 = document.querySelector('.img1');
diceImage1.setAttribute('src', 'images/dice' + randomNumber1 + '.png');

var diceImage2 = document.querySelector('.img2');
diceImage2.setAttribute('src', 'images/dice' + randomNumber2 + '.png');

// Decide winner
var header = document.querySelector('h1');
if (randomNumber1 > randomNumber2) {
  header.textContent = ' Player 1 Wins!';
} else if (randomNumber2 > randomNumber1) {
  header.textContent = 'Player 2 Wins! ';
} else {
  header.textContent = 'Draw!';
}
