$(document).ready(function() {

  //1. Create general variables and sent here general functions
  var generalLibrary = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"];
  var currentLibrary = [];
  var myCurrentWord = "";
  var myPoints = 0;
  var currentPoint = 0;
  var a = setInterval(makeTimer, 1000);


  function createNewGame() {
    for(var i = 0; i<16; i++) {
      var currentLetter = generalLibrary[Math.floor(Math.random()*generalLibrary.length)];
      currentLibrary.push(currentLetter);
    }
  } //end of createNewGame

  function resetOldGame() {
    currentLibrary = [];
    myCurrentWord = "";
    myPoints = 0;
    currentPoint = 0;
    $(".points").text("");
    $("#word-field").text("");
    $(".words-list").empty();
    myCurrentWord = "";
  } //end of resetOldGame

  function createWord() {
    document.getElementById('audiotag1').play();  //play sound
    var currentLetter = $(this).text();
    if($(this).hasClass("active-letter") === true) {
      document.getElementById('same-letter').play();
      $(this).removeClass("active-letter");
      myCurrentWord = myCurrentWord.replace(currentLetter, '');
    }
    else {
      $(this).addClass("active-letter");
      myCurrentWord = myCurrentWord + currentLetter
    }
    $('#word-field').text(myCurrentWord);
    console.log(myCurrentWord);
  } //end of createWord

  function checkWord() {
    if(myCurrentWord.length > 2) {
      $.getJSON('http://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=' + myCurrentWord + '&pretty=true&callback=?', 
      function(data) {
        console.log(data);
        if (data.tuc) {
          $('.mark').addClass('win-mark');
          document.getElementById('correct').play();
          setInterval(function(){
            $(".mark").removeClass('win-mark');
          }, 500);
          // let's send this to board and count points
          getPoints();
          $(".words-list").append("<li><p>" + myCurrentWord +"</p><span>" + currentPoint + "</span></li>");
          clearField();
        }
        else {
          $('.mark').addClass('fail-mark');
          document.getElementById('fail').play();
          setInterval(function(){
            $(".mark").removeClass('fail-mark');
          }, 500);
          clearField();
        }
      });
    }
  } //end of checkWord 

  function getPoints() {
    if(myCurrentWord.length === 3) {
      currentPoint = 2;
    }

    else if (myCurrentWord.length === 4) {
      currentPoint = 3;
    }

    else if (myCurrentWord.length === 5) {
      currentPoint = 4;
    }

    else {
      currentPoint = 5;
    }
    myPoints = myPoints + currentPoint;
     $(".points").text(myPoints + " pts");
  } //end of getPoints

  function clearField() {
    myCurrentWord = "";
    $("li").removeClass("active-letter");
    $('#word-field').text("");
  }

  //2. Click "start" and make random library
  $(".start-button").on("click", function() {
     $(".finish").hide();
    $(".landing-container").hide();
   
    resetOldGame();
    createNewGame();
    makeTimer();  // not sure about it
    // fill html with this letters
    currentLibrary.forEach(function(letter, index) {
      $(".letter_" + (index + 1)).html(letter);
    });
  });

  //3. Create new word by clicking on letters
  $("#words-field li").on('click', createWord);

  //4. Check if we have this word
  $("#check").on('click', checkWord);

  //5. Clear field on click
  $("#clear").on('click', clearField);

  //6. Set timer
  var minutes = 1;
  var seconds = 00;

  function makeTimer() {
     seconds--;
    if(seconds < 10 && seconds >= 0) {
      seconds = "0" + seconds;
     }
     else if(seconds === -1 && minutes != 0) {
      minutes--;
      seconds = 59;
     }
     else if (minutes === 0 && seconds === -1) {
      clearTimeout(a);
      showEnd();
     }
     $("#timer").text(minutes + " : " + seconds);
     seconds = parseInt(seconds);
  }

  function showEnd() {
    $(".finish").show();
    $(".finish").find("p").html("You got " + myPoints + " points!");
  }
  


}); //end of ready