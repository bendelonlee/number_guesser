
// Wraps all my event listeners in this anonymous callback that will run only
// when the page is loaded to avoid bugs
$( document ).ready(function() {
  // At first I had these as local variables with let and was passing them from
  // function to function. Eventually, it was simpler to change them to the more
  // global var.
  var answer; // the answer that will be randomly generated
  var min; // the minimum of the range that the user will provide...
  var max; // ... as well as the maximum.
  var numGuesses = 0; // the number of guesses the user has taken this roung
  var roundEnded = false; // A boolean used so you can't keep pressing guess...
  //... after you get the right answer.

  $('.number-input').keyup( function(key) {
    //listener for 'key up' on number-input field during set up. I tried to
    //listen for other
    //events, but ran into issues. Change, for example, was a little too delayed.
    //Key down listend too early. Key up seemed right.
    if($('#min-input').val() || $('#max-input').val()) {
      // if either the min or max fields have values
      $('#clear-button').addClass('enabled-button');
      // then the clear button is enabled
    } else {
      //otherwise it's diabled.
      $('#clear-button').removeClass('enabled-button');
    }
    if($('#min-input').val() && $('#max-input').val()) {
      //if both the min and max input have values
      $('.set-button').addClass('enabled-button');
      //then the set button becomes enabled.
    } else {
      // otherwise it's disabled.
      $('.set-button').removeClass('enabled-button');
    }
    if(key.which == 13) {
      // if the enter key is pressed keyuped, it's like clicking the enter button
      $('#enter-button').click();
    }
  });



  $('.set-button').click(function() {
    //when the set button is clicked
    min = parseInt($('#min-input').val());
    // the min variable gets set by user input
    max = parseInt($('#max-input').val()); // as does the max variable.
    if (Number.isNaN(min) && Number.isNaN(max)) {
      // if the max and min are not numbers
      $('#errors').html(`Invalid min and max. `) // an error is shown
    } else if (Number.isNaN(max)) { // or if just the max isn't valid
      $('#errors').html(`Invalid maximum. `) // an error is shown
    } else if (Number.isNaN(min)) { // or if just the min isn't valid
      $('#errors').html(`Invalid minimum. `) // an error is shown
    } else if (min >= max) { // or if min isn't less than the max
      $(`#errors`).html(`Min must be less than max.`) // an error is shown
    } else { // otherwise
      $(`#errors`).html(''); //any displayed errors are cleared
      setUpGuessing(); // and the first guessing round is set up
    }
  });

  $('#clear-button').click( function() {
    // when the clear button is clicked
    $('.number-input').val(''); // all number inputs are cleared
    $(this).removeClass('enabled-button'); // the clear button is no longer enabled
    $('#enter-button').removeClass('enabled-button'); // the clear button is no longer enabled
  });

  function listenForKeyUpsGuessing() {
    // when a key up happens in a number input field during the guessing
    $('.number-input').keyup( function(key) {
      if($('.number-input').val()) { // if there is any value in the number input field
        $('#enter-button').addClass('enabled-button'); // the enter...
        $('#clear-button').addClass('enabled-button'); //...and clear buttons are enabled
      } else {
        $('#enter-button').removeClass('enabled-button'); // otherwise they are
        $('#clear-button').removeClass('enabled-button'); // disabled.
      }
      if(key.which == 13) { // if the enter key is keyupped,
        $('#enter-button').click(); // it counts as clicking on the enter button
      } // (this code is unideally redundant)
    });
  }

  $('#reset-button').click( function() {
    //adds a click listener on the reset button.

    if (!$(this).hasClass('enabled-button')) { return true; }
    $('#guess-input').val('');  // removes text from the input field
    $('#feedback').val(''); // and the feedback area (ie 'BOOM!')
    $('#last-guess').html('&nbsp;') // and the last guess. Uses non-breaking
    //space so it doesn't collapse.
    $('button').removeClass('enabled-button');  //disables all buttons
    numGuesses = 0; //resets the guess counter to 0
    min = min - 10;// increases the size of the range
    max += 10;// in both directions
    setUpAnswer(); // calls the setUpAnswer function
    roundEnded = false; // sets roundEnded to false
  });

  function listenForGuess() {
    //wraps listen in a function because '.guess-button' doesn't exist when the
    //document first loads
    $('.guess-button').click(function() { //when the guess button is clicked
      if($(this).hasClass('enabled-button') && roundEnded == false) {
    //if it is enabled and the round hasn't ended
        let guessInt = parseInt($('#guess-input').val());
    // the input inside the guess input field is parsed
        if (checkIntForErrors(guessInt)) { return true; }
    // and checked for errors. If there are any errors, the function stops running.
        numGuesses += 1;
    // otherwise the number of guesses is incremented
        checkGuess(guessInt);
    // and the guess is checked against the randomly selected answer.
      }
    });
  }

  function setUpGuessing() {
    // once the set up is over, this function is called.
    $('#min-input').detach(); // the min-input button is removed
    $('#max-input').detach(); // as is the max input button
    $('#guess-input').show(); // the hidden guess input button is revealed.
    $('#enter-button').html('Guess'); // the enter button is changed from "set" to "guess"
    $('.set-button').unbind('click'); // its old listener is removed

    $('#enter-button').removeClass('set-button'); // its class is changed
    $('#enter-button').addClass('guess-button'); // from set-button to guess-button
    $('.number-input').unbind('keyup'); // the old key ups that relate to the min
    // and max input fields are removed
    listenForKeyUpsGuessing(); // A new key up listener is added, replacing the old one
    listenForGuess(); // a new listener is added for the guess button
    setUpAnswer(); // selects an answer and displays it.
  }

  function setUpAnswer() {
    // defines function that takes a range and sets up an answer
    $('#guess-input').attr('placeholder', `Enter a guess from ${min} to ${max}`)
    //writes the min and max into the placeholder text
    $('#guess-input').attr('min', min)
    //alters the number input field to have the right mind
    $('#guess-input').attr('max', max) // and max
    $('#top-feedback').html('&nbsp')
    // clears the feedback areas
    $('#feedback').html('&nbsp')
    answer = Math.floor((Math.random() * (max - min)) + min);
    //returns a random number inside the range to be stored by the parent function.

  }

  function checkIntForErrors(guessInt) {
    //defines a function that takes a parsed guess and checks it for erros
    if (Number.isNaN(guessInt)) {
    // If the number is Not a Number....
      $('#errors').html(`Invalid input. Please enter a number between ${min} and ${max}`)
    // it writes an error message to the error div on the dom.
      return true;
    // and returns true so that the calling function can return without continuing.
  } else if (guessInt > max || guessInt < min) {
    // If the number is outside the range...
      $('#errors').html(`Out of range. The number is between ${min} and ${max}`)
    // writes the error message on the dom.
      return true;
    // returns true.
  } else {
    // if there's nothing wrong with the answer
      $('#errors').html('')
    // the errors div on the dom is cleared.
      return false;
    // returning false means the parent function will continue on.
  }
  }

  function checkGuess(guessInt) {
    // gets called on the parsed, error checked user guess.
    $('#top-feedback').html('Your last guess was');
    // adds feedback text (usually it will already be there)
    $('#last-guess').html(guessInt);
    // fills in the last guess p tag with the user's last guess
    if (guessInt > answer) { // if the guess is greater than the answer
      $('#feedback').html('That guess is too high!') // says so
    } else if (guessInt < answer) { // if it's lower
      $('#feedback').html('That guess is too low!') // says so
    } else if (guessInt == answer){ // if the user correctly guessed the answer
      $('#feedback').html(`BOOM! You got the answer in ${numGuesses} guesses!`)
      // credit is given where credit is due. Includes how many guesses the user took.
      $('#enter-button').removeClass('enabled-button') // the enter button is disabled.
      $('#reset-button').addClass('enabled-button') // the reset button is enabled.
      roundEnded = true; // the round ended variable is set to true so you can't press on guess
    }
  }

});
