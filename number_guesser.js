$( document ).ready(function() {
  let numGuesses = 0;
  let min = 40;
  let max = 50;
  let answer = setUpAnswer(min, max);

  $('#guess-button').click(function() {
    let guessInt = parseInt($('#number-input').val());
    if (checkIntForErrors(guessInt, min, max)) { return true; }
    numGuesses += 1;
    checkGuess(guessInt, answer, numGuesses)
  });

  $('#clear-button').click( function() {
    $('#number-input').val('');
  });

  $('#number-input').keyup( function(key) {
    if($(this).val()) {
      $('#guess-button').addClass('enabled-button');
      $('#clear-button').addClass('enabled-button');
    } else {
      $('#guess-button').removeClass('enabled-button');
      $('#clear-button').removeClass('enabled-button');
    }
    if(key.which == 13) {
      $('#guess-button').click();
    }
  });

  $('#reset-button').click( function() {
    $('#number-input').val('');
    $('#feedback').val('');
    $('button').removeClass('enabled-button');
    numGuesses = 0
    min -= 10;
    max += 10;
    answer = setUpAnswer(min, max)
  });
});

function setUpAnswer(min, max) {
  $('#number-input').attr('placeholder', `Enter a guess from ${min} to ${max}`)
  $('#number-input').attr('min', min)
  $('#number-input').attr('max', max)
  return Math.floor((Math.random() * (max - min)) + min);
}

function checkIntForErrors(guessInt, min, max) {
  if (Number.isNaN(guessInt)) {
    $('#errors').html(`Invalid input. Please enter a number between ${min} and ${max}`)
    return true;
  } else if (guessInt > max || guessInt < min) {
    $('#errors').html(`Out of range. The number is between ${min} and ${max}`)
    return true;
  } else {
    $('#errors').html('')
    return false;
  }
}

function checkGuess(guessInt, answer, numGuesses) {
  $('#last-guess').html(guessInt);
  if (guessInt > answer) {
    $('#feedback').html('That guess is too high!')
  } else if (guessInt < answer) {
    $('#feedback').html('That guess is too low!')
  } else {
    $('#feedback').html(`BOOM! You got the answer in ${numGuesses} guesses!`)
    $('#reset-button').addClass('enabled-button')
  }
}
