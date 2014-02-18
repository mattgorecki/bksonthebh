var gameElement = $("#game");
var kissTimeout = 1000;
var puckerTimeout = 200;
var kisses = 0;
var longestStreak = 0;
var currentStreak = 0;
var gameTimer = 0.0;
var lastClickTimer = 0.0;

var achievements = [
  { id: 0, kisses: 7, name: "Lucky 7", description: "7 total clicks", applied: false },
  { id: 1, kisses: 42, name: "Bring Your Towel", description: "42 total clicks", applied: false },
  { id: 2, name: "Jesus Christ, I'm at work.", description: "Muted the audio", applied: false },
  { id: 3, name: "That's what I call an educated guess.", description: "Hovered over Help Me", applied: false },
  { id: 4, elapsedTime: 300, name: "Busy day at work.", description: "Browser window open for more than 5 minutes", applied: false },
  { id: 5, lastClickTime: 300, name: "Idle buttholes are the devil's playground.", description: "No clicks for 5 minutes", applied: false }
]

// Preload images into hidden img tag
var preloads = [
  '/img/lipstick-64.png',
  '/img/perfect-butthole-relaxed.jpg',
  '/img/perfect-butthole-puckered.jpg',
  '/img/perfect-butthole-puckered2.jpg'
];

// Load game sounds
var sounds = [
  'kiss1',
  'kiss2',
  'kiss3',
  'kiss4'
];


$(function() {
  var gameElement = $("#game");

  // Game Timer and Click Timer
  var startTime = new Date().getTime();
  var lastClickTime = new Date().getTime();

  window.setInterval(function() {
    var overallTime = new Date().getTime() - startTime;
    lastClickTimer = new Date().getTime() - lastClickTime;

    gameTimer = Math.floor(overallTime / 100) / 10;
    lastClickTimer = Math.floor(lastClickTimer / 100) / 10;

    if(Math.round(gameTimer) == gameTimer) { gameTimer += '.0'; }
    if(Math.round(lastClickTimer) == lastClickTimer) { lastClickTimer += '.0'; }

    $("#timer").html(gameTimer);
    $("#clickTimer").html(lastClickTimer);

    // Check for achievements
    checkForAchievement();
  }, 100);

  // Background audio
  var bgMusic = $('#audio-bg')[0];
  var playing = true;
  bgMusic.volume = .6;
  bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    if (playing) {
      this.play();
    }
  }, false);
  bgMusic.play();

  $.ionSound({
    sounds: sounds,
    path: "sounds/"
  });

  preloads.forEach(function(i){
    $('<img/>')[0].src = i;
  });

  // Fade in the game image
  setTimeout(function() {
    gameElement.fadeIn(2000);
  }, 500);

  // Fade in the sidebar advertisement
  setTimeout(function() {
    $("#adcontainer").show(5000);
  }, 7000);

  function createKiss(x,y) {
    var kiss = $("<div>&nbsp;</div>");
    var uniqueId = _.uniqueId('kiss_');
  
    lastClickTime = new Date().getTime();

    kiss.addClass("kiss");
    kiss.attr("id", uniqueId);
    kiss.css("left", x - 32);
    kiss.css("top", y - 28);
    kiss.css({ WebkitTransform: 'rotate(' + randomRotation() + 'deg)'});
    kiss.appendTo(gameElement);

    puckerUp();

    // Smooch me
    var randomKissSound = sounds[Math.floor(Math.random() * (sounds.length - 1))];
    $.ionSound.play(randomKissSound);

    // Remove the kiss element
    setTimeout(function(){
      $("#" + uniqueId).fadeOut("slow", function() {
        $(this).remove();
      });
    }, kissTimeout);
  }

  // Increment kisses and update score
  function countKiss() {
    kisses++;
    $("#kissCount").html(kisses);
  }

  // Pucker up that butthole
  function puckerUp() {
    gameElement.removeClass("relaxed").addClass("puckered");

    setTimeout(function() {
      gameElement.removeClass("puckered").addClass("relaxed");
    }, puckerTimeout);
  };

  // Helper function to give kisses a random rotation
  function randomRotation() {
    var min = -30;
    var max = 60;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  // #touchscreen is a transparent div on top of the game board and other elements 
  $("#touchscreen").click(function(e) {
    createKiss(e.offsetX, e.offsetY);
    countKiss();

    if (kisses % Math.floor((Math.random()*10)+3) == 0) {
      gameElement.removeClass("relaxed").addClass("puckered2");

      setTimeout(function() {
        gameElement.removeClass("puckered2").addClass("relaxed");
      }, puckerTimeout);
    }
  });

  // Check for kiss click achievements
  function checkForAchievement() {
    achievements.forEach(function(i) {
      if (!i.applied) {
        if (i.hasOwnProperty('kisses') && i.kisses == kisses) {
          applyAchievement(i.id);
        }

        if (i.hasOwnProperty('elapsedTime') && i.elapsedTime < gameTimer) {
          applyAchievement(i.id);
        }

        if (i.hasOwnProperty('lastClickTime') && i.lastClickTime < lastClickTimer) {
          applyAchievement(i.id);
        }
      }
    });
  }

  // Add achievement
  function applyAchievement(id) {
    if (!achievements[id].applied) {
      $("#achievementList").prepend("<li>" + achievements[id].name + "</li>");
      achievements[id].applied = true;
    }
  }

  // Menu items
  $("#help").hover(function() {
    $("#kissthebutthole").fadeIn('fast');
    applyAchievement(3);
  }, function() {
    $("#kissthebutthole").fadeOut('slow');
  });

  $('#togglemusic').click(function() {
    if (!bgMusic.paused) {
      $("#togglemusic").css("text-decoration", "line-through");
      bgMusic.pause();
      playing = false;
      applyAchievement(2);
    } else {
      $("#togglemusic").css("text-decoration", "none");
      bgMusic.play();
      playing = true;
    }
  });
  
});
