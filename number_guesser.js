

$( document ).ready(function() {
  var answer;
  var min;
  var max;
  var numGuesses = 0;
  var roundEnded = false;
  listenForKeyUpsSetup();

  function listenForKeyUpsSetup() {
    $('.number-input').keyup( function(key) {
      if($('#min-input').val() || $('#max-input').val()) {
        $('#clear-button').addClass('enabled-button');
      } else {
        $('#clear-button').removeClass('enabled-button');
      }
      if($('#min-input').val() && $('#max-input').val()) {
        $('.set-button').addClass('enabled-button');
      } else {
        $('.set-button').removeClass('enabled-button');
      }
      if(key.which == 13) {
        $('#enter-button').click();
      }
    });
  }


  $('.set-button').click(function() {
    min = parseInt($('#min-input').val());
    max = parseInt($('#max-input').val());
    if (Number.isNaN(min) && Number.isNaN(max)) {
      $('#errors').html(`Invalid min and max. `)
    } else if (Number.isNaN(max)) {
      $('#errors').html(`Invalid maximum. `)
    } else if (Number.isNaN(min)) {
      $('#errors').html(`Invalid minimum. `)
    } else if (min >= max) {
      $(`#errors`).html(`Min must be less than max.`)
    } else {
      $(`#errors`).html('');
      debugger;
      setUpRound();
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
    if (!$(this).hasClass('enabled-button')) { return true; }
    $('#guess-input').val('');
    $('#feedback').val('');
    $('#last-guess').html('&nbsp;')
    $('button').removeClass('enabled-button');
    numGuesses = 0;
    min = min - 10;
    max += 10;
    setUpAnswer();
    roundEnded = false;
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
    $('#guess-input').attr('placeholder', `Enter a guess from ${min} to ${max}`)
    $('#guess-input').attr('min', min)
    $('#guess-input').attr('max', max)
    $('#top-feedback').html('&nbsp')
    $('#feedback').html('&nbsp')
    answer = Math.floor((Math.random() * (max - min)) + min);
  }

  function checkIntForErrors(guessInt) {
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
