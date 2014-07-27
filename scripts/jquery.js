$(document).ready(function() {

  //1. Create general variables and sent here general functions
  var generalLibrary = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"];
  var currentLibrary = [];
  var myCurrentWord = "";
  var myListOfWords = [];
  var myPoints = 0;
  var currentPoint = 0;
  var timerID;
  var minutes;
  var seconds;


  function createCurrentLibrary() {
    for(var i = 0; i<16; i++) {
      var currentLetter = generalLibrary[Math.floor(Math.random()*generalLibrary.length)];
      currentLibrary.push(currentLetter);
    }
    console.log(currentLibrary);
    checkCurrentLibrary();
  }

  function checkCurrentLibrary() {
    var numberOfVowels = 0;
    for (var i = 0; i<currentLibrary.length; i++) { 
      if(currentLibrary[i] === "a"||currentLibrary[i] === "o"||currentLibrary[i] === "e"||currentLibrary[i] === "i"||currentLibrary[i] === "u") {
        numberOfVowels++;
      }
    }
    console.log(numberOfVowels);
    if(numberOfVowels < 2 || numberOfVowels > 5) {
      console.log("Restricted number of vowels!");
      currentLibrary = [];
      createCurrentLibrary();
    }  
  } //end of checkCurrentLibrary (check how many vowels we have)

  function createNewGame() {
    timerID = setInterval(makeTimer, 1000); //set interval
    createCurrentLibrary();
    
  } //end of createNewGame

  function resetOldGame() {
    minutes = 3;
    seconds = 00;
    currentLibrary = [];
    myListOfWords = [];
    myCurrentWord = "";
    myPoints = 0;
    currentPoint = 0;
    $("li").removeClass("is-active");
    $(".points").text("");
    $("#word-field").text("");
    $(".words-list").empty();
    myCurrentWord = "";
  } //end of resetOldGame

  function createWord() {
     $("p").removeClass('is-existed');  //in case previous word was repeated
    document.getElementById('audiotag1').play();  //play sound
    var currentLetter = $(this).text();
    if($(this).hasClass("is-active") === true) {
      document.getElementById('same-letter').play();
      $(this).removeClass("is-active");
      myCurrentWord = myCurrentWord.replace(currentLetter, '');
    }
    else {
      $(this).addClass("is-active");
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
          //if we already used this word
          for (var i = 0; i < myListOfWords.length; i++) {
            if (myCurrentWord === myListOfWords[i]) {
              $("p:contains('" + myCurrentWord + "')").addClass('is-existed');
              clearField();
              return;
            }
          } //end of for
          //if word is new
         
          myListOfWords.push(myCurrentWord);
          console.log(myListOfWords);
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
    $("li").removeClass("is-active");
    $('#word-field').text("");
  } // end of clearField

  //2. Click "start" and make random library
  $(".start-button").on("click", function() {
    $(".finish").hide();
    $(".landing-container").hide(); 
    resetOldGame();
    createNewGame();
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
  function makeTimer() {
    seconds--;
    if (minutes === 0 && seconds === 0) {
      myStopFunction();
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
  }

  function myStopFunction() {
    clearInterval(timerID);
}

  function showEnd() {
    $(".finish").show();
    $(".finish").find("p").html("You got " + myPoints + " points!");
  }
  


}); //end of ready