$(document).ready(function() {

  //1. Create general variables and sent here general functions
  var word = "";
  var gameTimer;
  var usedWords = [];
  var generalPoint = 0;

  //2. Click "start" and make random library
  $(".start-button").on("click", startGame);

  //3. Create new word by clicking on letters
  $("#words-field li").on('click', verifyLetter);

  //4. Check if we have this word
  $("#check").on('click', verifyWordforExistence);

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

    $("li").removeClass("is-active");
    $(".points").text("");
    $("#word-field").text("");
    $(".words-list").empty();
  } //end of resetOldGame

  function createNewGame() {
    gameTimer = setInterval(setTimer, 1000);
    createRandomLetters();  
  } //end of createNewGame

  function createRandomLetters() {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"];
    var currentLibrary = [];
    for(var i = 0; i < 16; i++) {
      var currentLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
      currentLibrary.push(currentLetter);
    }
    checkLetters(currentLibrary);  
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
    if(numberOfVowels < 2 || numberOfVowels > 5) {
      createRandomLetters();
    }  
    else {
      showLetters(array);
    } 
  } //end of checkLetters (check how many vowels we have)

  function showLetters(array) {
    array.forEach(function(letter, index) {
      $(".letter_" + (index + 1)).html(letter);
    });
  }  //end of showLetters

  function verifyLetter() {
    var letter = $(this).text();
    if($(this).hasClass("is-active") != true) {
      addLetter(letter, true);
      $('#audiotag1')[0].play();
    }
    else {
      addLetter(letter, false);
      $('#same-letter')[0].play();  
    }
    $(this).toggleClass('is-active');
  } //end od verifyLetter

  function addLetter(letter, value) {
    if (value === true) {
      word = word + letter;
    }
    else {
      word = word.replace(letter, '');
    }
    $("#word-field").text(word);
  } //end of create word

  function verifyWordforExistence() {
    $("p").removeClass("is-existed");
    if (word.length < 2) {
      return;
    }
    $.getJSON('http://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=' + word + '&pretty=true&callback=?', 
    function(data) {
      if (data.tuc) {
        verifyWordForUsing();
      }
      else {
        $('.mark').addClass('fail-mark');
        $('#fail')[0].play();
        setInterval(function(){
          $(".mark").removeClass('fail-mark');
        }, 500);
        clearField();
        word = "";
      }
    });
    console.log(word);
  } //end of verifyWordforExistence

  function verifyWordForUsing() {
    if(usedWords.length > 0) {
      for (var i = 0; i < usedWords.length; i++) {
        if(usedWords[i] === word) {
          console.log("Not");
          markUsedWord();
          return;
        }
      }
      acceptWord();
    }
    else {
      acceptWord();
    }
  } // end of verifyWordForUsing

  function acceptWord() {
    usedWords.push(word);
    console.log("Word accepted!");
    addToList();
  }

  function markUsedWord() {
    console.log("I was used");
    $("p:contains('" + word + "')").addClass('is-existed');
    $('ul').animate({scrollTop: $(".is-existed").height()}, 'slow');
    clearField();
    word = "";
  } // end of markUsedWord

  function addToList() {
    console.log("i'm in add to list");
      $('#correct')[0].play();
      var point = getPoint();
      $(".words-list").append("<li><p>" + word +"</p><span>" + point + "</span></li>").animate({scrollTop: $("ul").height()}, 'slow');
      setTimer(function(){
        $(".mark").removeClass('win-mark');
      }, 500);
      clearField();
      word = "";
  }  //end of addToList

  var getPoint = function() {
    console.log("I count points");
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
    console.log(generalPoint);
    $(".points").text(generalPoint + " pts");
    return point;
  }

  function clearField() {
    word = "";
    $("li").removeClass("is-active");
    $('#word-field').text("");
  } // end of clearField

  //6. Set timer
 
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