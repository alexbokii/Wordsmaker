$(document).ready(function() {

  //1. Create general variables and sent here general functions
  var word = "";
  var gameTimer;
  var usedWords = [];
  var generalPoint = 0;

  //2. Click "start" and make random library
  $(".start-button").on("click", startGame);

  //3. Create new word by clicking on letters
  $("#words-field li").on('click', checkLetter);

  //4. Check if we have this word
  $("#check").on('click', verifyWordForExistenceAndPreviousUsing);

  //5. Clear field on click
  $("#clear").on('click', clearField);

  function startGame() {
    $(".finish").hide();
    $(".landing-container").hide();

    resetOldGame();
    createNewGame();
  }

  function resetOldGame() {
    minutes = 3;
    seconds = 00;
    usedWords = [];
    word = "";
    generalPoint = 0;

    $("li").removeClass("is-active");
    $(".points").text("");
    $("#word-field").text("");
    $(".words-list").empty();
  } //end of resetOldGame

  function createNewGame() {
    gameTimer = setInterval(setTimer, 1000);

    do {
      var arrayOfLetters = createRandomLetters();
      var numberOfVowels = checkLetters(arrayOfLetters);
    } while (numberOfVowels < 2 || numberOfVowels > 5);

    showLetters(arrayOfLetters);
  } //end of createNewGame

  function createRandomLetters() {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"];
    var currentLibrary = [];
    for(var i = 0; i < 16; i++) {
      var currentLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
      currentLibrary.push(currentLetter);
    }
    return currentLibrary;
  } //end of createRandomLetters

  function checkLetters(array) {
    var numberOfVowels = 0;
    for (var i = 0; i < array.length; i++) { 
      if(array[i] === "a" 
        || array[i] === "o" 
        || array[i] === "e" 
        || array[i] === "i" 
        || array[i] === "u") {
        numberOfVowels++;
      }
    }
    return numberOfVowels;
  } //end of checkLetters

  function showLetters(array) {
    array.forEach(function(letter, index) {
      $(".letter_" + (index + 1)).html(letter);
    });
  }  //end of showLetters

  function checkLetter() {
    var letter = $(this).text();

    if($(this).hasClass("is-active") != true) {
      $('#audiotag1')[0].play();
      appointCheckedLetter(letter, true); 
    }
    else {
      $('#same-letter')[0].play();
      appointCheckedLetter(letter, false);  
    }
    $(this).toggleClass('is-active');
  } //end of checkLetter

  function appointCheckedLetter(letter, value) {
    if (value === true) {
      word = word + letter;
    }
    else {
      word = word.replace(letter, '');
    }
    $("#word-field").text(word);
  } //end of create word

  function verifyWordForExistenceAndPreviousUsing() {
    $("p").removeClass("is-existed");
    if (word.length < 2) {
      return;
    }
    $.getJSON('http://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=' + word + '&pretty=true&callback=?', 
    function(data) {
      if (data.tuc) {
        var newWord = verifyExistedWordForUsing();
        if(newWord === true) {
          addToListAndGetPoints();
        }
      }
      else {
        markWordAsNotExisted(); 
      }
    });
  } //end of verifyWordForExistenceAndPreviousUsing

  function verifyExistedWordForUsing() {
    if(usedWords.length > 0) {
      for (var i = 0; i < usedWords.length; i++) {
        if(usedWords[i] === word) {
          markWordAsAlreadyUsed();
          return;
        }
      }
    }
    return true;
  } // end of verifyExistedWordForUsing

  function markWordAsNotExisted() {
    $('.mark').addClass('fail-mark');
    $('#fail')[0].play();
    setTimeout(function(){
      $(".mark").removeClass('fail-mark');
      clearField();
    }, 600);
  } // end of markWordAsNotExisted

  function markWordAsAlreadyUsed() {
    $("p:contains('" + word + "')").addClass('is-existed');
    $('ul').animate({scrollTop: $(".is-existed").height()}, 'slow');
    clearField();
  } // end of markWordAsAlreadyUsed

  function addToListAndGetPoints() {
    usedWords.push(word);
    $('#correct')[0].play();
    var point = getPoints();
    $(".words-list").append("<li><p>" + word +"</p><span>" + point + "</span></li>").animate({scrollTop: $("ul").height()}, 'slow');
    setTimeout(function(){
      $(".mark").removeClass('win-mark');
      clearField();
    }, 600);
  } // end of addToListAndGetPoints

  function getPoints() {
    var point;
    if (word.length === 3) {
      point = 2;
    }
    else if (word.length === 4) {
      point = 3;
    }
    else if (word.length === 5) {
      point = 4;
    }
    else {
      point = 5;
    }
    generalPoint = generalPoint + point;
    $(".points").text(generalPoint + " pts");
    return point;
  } // end of getPoints;

  function clearField() {
    word = "";
    $("li").removeClass("is-active");
    $('#word-field').text("");
  } // end of clearField

  //6. Set timer
  var minutes = 3;
  var seconds = 0;
  function setTimer() {
    seconds--;
    if (minutes === 0 && seconds === 0) {
      stopTimer();
      showEnd();
      minutes = 3;
      seconds = "00";
     }
     else if(seconds < 10 && seconds >= 0) {
      seconds = "0" + seconds;
     }
     else if(seconds === -1 && minutes != 0) {
      minutes--;
      seconds = 59;
     }
     $("#timer").text(minutes + " : " + seconds);
     seconds = parseInt(seconds);
  } // end of setTimer

  function stopTimer() {
    clearInterval(gameTimer);
  } // end of stopTimer

  function showEnd() {
    $(".finish").show();
    $(".finish").find("p").html("You got " + generalPoint + " points!");
  } // end of showEnd
}); //end of ready