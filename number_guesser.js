// Wraps all my event listeners in this anonymous callback that will run only
// when the page is loaded to avoid bugs
$( document ).ready(function() {
  // sets up variables. Using let because there's no  reason to use a more
  // global variable than is required. ES6
  let numGuesses = 0; //the number of guesses a user has taken.
  let min = 40; //the min and max of the range of possible answer
  let max = 50;
  let answer = setUpAnswer(min, max);
  //calls setUp answer (defined below) which selects and returns a random answer
  //and manipulates the dom using the min and max

  $('#guess-button').click(function() {
    //listener for a click on the 'guess button' with an anonymous callback
    let guessInt = parseInt($('#number-input').val());
    // takes the text that's in the input field and parses it into an integer
    if (checkIntForErrors(guessInt, min, max)) { return true; }
    // calls a method defined below. If the method returns true, then there are
    //errors in the input. Therefore this line will also return true, exiting
    // the main function.
    numGuesses += 1; //increments the count of the user's guesses
    checkGuess(guessInt, answer, numGuesses)
    // I suppose I could experiment with using var instead of having to pass in
    // these variables, but this works.
  });

  $('#clear-button').click( function() {
    //listener for a click on the button with id clear-button
    $('#number-input').val(''); //removes all text from the input field
  });

  $('#number-input').keyup( function(key) {
    //listener for 'key up' on number-input field. I tried to listen for other
    //events, but ran into issues. Change, for example, was a little too delayed.
    //Key down listend too early. Key up seemed right.
    if($(this).val()) {
      // checks to see that the input field has something in it, and if it does...
      $('#guess-button').addClass('enabled-button'); // enables the guess button
      $('#clear-button').addClass('enabled-button'); // enables the clear button
    } else { // and if it isn't
      $('#guess-button').removeClass('enabled-button'); // disables those buttons
      $('#clear-button').removeClass('enabled-button');
    }
    if(key.which == 13) { // if the key pressed is 'enter'
      $('#guess-button').click(); // clicks on the guess button for you
    }
  });

  $('#reset-button').click( function() {
    //adds a click listener on the reset button.
    $('#number-input').val(''); // removes text from the input field
    $('#feedback').val(''); // and the feedback area (ie 'BOOM!')
    $('button').removeClass('enabled-button'); //disables all buttons
    numGuesses = 0 //resets the guess counter to 0
    min -= 10; // increases the size of the range
    max += 10; // in both directions
    answer = setUpAnswer(min, max)
    // calls function defined below, the same function that was called on line 7
  });
});

function setUpAnswer(min, max) {
  // defines function that takes a range and sets up an answer
  $('#number-input').attr('placeholder', `Enter a guess from ${min} to ${max}`)
  //writes the min and max into the placeholder text
  $('#number-input').attr('min', min)
  //alters the number input field to have the right mind
  $('#number-input').attr('max', max) // and max
  return Math.floor((Math.random() * (max - min)) + min);
  //returns a random number inside the range to be stored by the parent function.
}

function checkIntForErrors(guessInt, min, max) {
  //defines a function that takes a parsed guess and checks it for erros
  if (Number.isNaN(guessInt)) { // If the number is Not a Number....
    $('#errors').html(`Invalid input. Please enter a number between ${min} and ${max}`)
    // it writes an error message to the error div on the dom.
    return true;
    // and returns true so that the calling function can return without continuing.
  } else if (guessInt > max || guessInt < min) {
    // If the number is outside the range...
    $('#errors').html(`Out of range. The number is between ${min} and ${max}`)
    // writes the error message on the dom.
    return true; // returns true.
  } else { // if there's nothing wrong with the answer
    $('#errors').html('') // the errors div on the dom is cleared.
    return false; // returning false means the parent function will continue on.
  }
}

function checkGuess(guessInt, answer, numGuesses) {
  //defines a function that takes a guess, answer, and the guess counter.
  $('#last-guess').html(guessInt); //writes the guess to the last-guess div
  if (guessInt > answer) { // If the guessed integer is too high
    $('#feedback').html('That guess is too high!') //the user gets that feedback
  } else if (guessInt < answer) { // If the guessed answer is too low
    $('#feedback').html('That guess is too low!') // the user gets that feedback
  } else if (guessInt == answer){ // if the answer is correct
    $('#feedback').html(`BOOM! You got the answer in ${numGuesses} guesses!`)
    // The user is told it's correct as well as how many guesses they took.
    $('#reset-button').addClass('enabled-button')
    // enables the reset button so you can start a new round.
  }
}
