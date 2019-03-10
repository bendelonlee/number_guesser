
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
      setUpRound(); // and the first guessing round is set upr
    }
  });

  $('#clear-button').click( function() {
    $('.number-input').val('');
    $(this).removeClass('enabled-button');
    $('#enter-button').removeClass('enabled-button');
  });

  function listenForKeyUpsRegular() {
    $('.number-input').keyup( function(key) {
      if($('.number-input').val()) {
        $('#enter-button').addClass('enabled-button');
        $('#clear-button').addClass('enabled-button');
      } else {
        $('#enter-button').removeClass('enabled-button');
        $('#clear-button').removeClass('enabled-button');
      }
      if(key.which == 13) {
        $('#enter-button').click();
      }
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
    $('.guess-button').click(function() {
      if($(this).hasClass('enabled-button') && roundEnded == false) {
        let guessInt = parseInt($('#guess-input').val());
        if (checkIntForErrors(guessInt)) { return true; }
        numGuesses += 1;
        checkGuess(guessInt);
      }
    });
  }

  function setUpRound() {
    $('#min-input').detach();
    $('#max-input').detach();
    $('#guess-input').show();
    $('#enter-button').html('Guess');
    $('.set-button').unbind('click');
    $('.number-input').unbind('keyup');
    $('#enter-button').removeClass('set-button');
    $('#enter-button').addClass('guess-button');
    setUpAnswer();
    listenForKeyUpsRegular();
    listenForGuess();
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
    $('#top-feedback').html('Your last guess was');
    $('#last-guess').html(guessInt);
    if (guessInt > answer) {
      $('#feedback').html('That guess is too high!')
    } else if (guessInt < answer) {
      $('#feedback').html('That guess is too low!')
    } else if (guessInt == answer){
      $('#enter-button').removeClass('enabled-button')
      $('#feedback').html(`BOOM! You got the answer in ${numGuesses} guesses!`)
      $('#reset-button').addClass('enabled-button')
      roundEnded = true;
    }
  }

});
