
$( document ).ready(function() {
  setUpAnswer(1, 5);
  $('#guess-button').click(function() {
    let guess = $('#number-input').val();
    let guessInt = parseInt(guess);
    if (Number.isNaN(guessInt)) {
      debugger;
    }
    $('#last-guess').html(guess);
    if (parseInt(guess) > answer) {
      $('#feedback').html('That guess is too high!')
    } else if (parseInt(guess) < answer) {
      $('#feedback').html('That guess is too low!')
    } else {
      $('#feedback').html('BOOM!')
      $('#reset-button').addClass('active-button')
    }
  });
  $('#clear-button').click( function() {
    $('#number-input').val('');
  });
  $('#number-input').keyup( function(key) {

    if($(this).val()) {
      $('#guess-button').addClass('active-button');
      $('#clear-button').addClass('active-button');
    } else {
      $('#guess-button').removeClass('active-button');
      $('#clear-button').removeClass('active-button');
    }

    if(key.which == 13) {
      $('#guess-button').click();
    }
  });
  $('#reset-button').click( function() {
    $('#number-input').val('')
    $('#feedback').val('')
    $('button').removeClass('active-button');

    answer = Math.floor(Math.random() * range);
  })
});

function setUpAnswer(min, max) {
  let answer = Math.floor((Math.random() * (max - min)) + min);
  $('#number-input').attr('placeholder', `Enter a guess from ${min} to ${max}`)
}
