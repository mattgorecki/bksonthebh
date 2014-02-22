var gameElement = $("#game");
var kissTimeout = 1000;
var puckerTimeout = 200;
var kisses = 0;
var longestStreak = 0;
var currentStreak = 0;
var streakTimeout = 0.5;
var gameTimer = 0.0;
var lastClickTimer = 0.0;

var achievements = [
  { id: 0, kisses: 7, name: "Lucky 7", description: "7 total clicks", applied: false },
  { id: 1, kisses: 42, name: "Bring your towel", description: "42 total clicks", applied: false },
  { id: 2, name: "Jesus Christ, I'm at work", description: "Muted the audio", applied: false },
  { id: 3, name: "That's what I call an educated guess", description: "Hovered over Help Me", applied: false },
  { id: 4, elapsedTime: 300, name: "Busy day at work", description: "Browser window open for more than 5 minutes", applied: false },
  { id: 5, lastClickTime: 300, name: "Idle buttholes are the devil's playground", description: "No clicks for 5 minutes", applied: false },
  { id: 6, longestStreak: 13, name: "Work that butthole", description: "Click streak of 13", applied: false },
  { id: 7, longestStreak: 100, name: "That butthole is raw", description: "Click streak of 100", applied: false },
  { id: 8, name: "BKs on the BH. +1", description: "Visit the POMO Facebook page", applied: false },
  { id: 9, name: "Who pays for porn? Pervert.", description: "Clicked on the porn banner ad", applied: false }
]

// Preload images into hidden img tag
var preloads = [
  '/img/lipstick-64.png',
  '/img/perfect-butthole-relaxed.jpg',
  '/img/perfect-butthole-puckered.jpg',
  '/img/perfect-butthole-puckered2.jpg'
];

// Load game sounds. Kisses are separate so we can randomly select one on click.
var kissSounds = [
  'kiss1',
  'kiss2',
  'kiss3',
  'kiss4',
];

var sounds = [
  'sexytime',
  'countit',
  'fantastic',
  'fromdowntown',
  'fromtheoutsidenogood',
  'heresthetip',
  'ohmyhesonfire',
  'uglyshot',
  'boomshakalaka',
  'for2',
  'fromtheoutsideyes',
  'heatingup',
  'hesonfire',
  'jamsitin',
  'razzledazzle',
  'takethat',
  'therebound',
  'breakblock',
  'bump',
  'fireball',
  'jump-small',
  'goal',
  'kick',
  'powerup',
  'raccoon',
  'smb_powerup',
  'stomp',
  'thud',
  'treasure_box', 
  'vine',
  'coin',
  'flame',
  'generic-event'
]

$(function() {
  var gameElement = $("#game");

  var gameCanvas = document.getElementById("gamecanvas");
  var ctx = gameCanvas.getContext("2d");
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  var gameBG = new Image();
  gameBG.onload = function() {
    pixelate(6);
  }

  gameBG.src = 'http://bksonthebh.com/img/perfect-butthole-relaxed.jpg';

  // Game Timer and Click Timer
  var startTime = new Date().getTime();
  var lastClickTime = new Date().getTime();

  window.setInterval(function() {
    var overallTime = new Date().getTime() - startTime;
    lastClickTimer = new Date().getTime() - lastClickTime;

    gameTimer = Math.floor(overallTime / 100) / 10;
    lastClickTimer = Math.floor(lastClickTimer / 100) / 10;

    if (Math.round(gameTimer) == gameTimer) { gameTimer += '.0'; }
    if (Math.round(lastClickTimer) == lastClickTimer) { lastClickTimer += '.0'; }

    if (lastClickTimer > streakTimeout) {
      currentStreak = 0;
      $("#longestStreakCount").removeClass("green");
      updateStreak();
    }

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
    sounds: sounds.concat(kissSounds),
    path: "sounds/"
  });

  preloads.forEach(function(i){
    $('<img/>')[0].src = i;
  });

  // Fade in the sidebar advertisement
  setTimeout(function() {
    $("#adcontainer").show(5000);
  }, 7000);

  function pixelate(v) {
    // ctx.drawImage(gameBG, 0, 0);
    /// if in play mode use that value, else use slider value
    var size = v * 0.01,
        /// cache scaled width and height
        w = gameCanvas.width * size,
        h = gameCanvas.height * size;

    /// draw original image to the scaled size
    ctx.drawImage(gameBG, 0, 0, w, h);

    /// then draw that scaled image thumb back to fill canvas
    /// As smoothing is off the result will be pixelated
    ctx.drawImage(gameCanvas, 0, 0, w, h, 0, 0, gameCanvas.width, gameCanvas.height);
  }

  function createKiss(x,y) {
    var kiss = $("<div>&nbsp;</div>");
    var uniqueId = _.uniqueId('kiss_');
  
    countKiss();

    kiss.addClass("kiss");
    kiss.attr("id", uniqueId);
    kiss.css("left", x - 32);
    kiss.css("top", y - 28);
    kiss.css({ WebkitTransform: 'rotate(' + randomRotation() + 'deg)'});
    kiss.appendTo(gameElement);

    puckerUp();

    // Smooch me
    var randomKissSound = kissSounds[Math.floor(Math.random() * (kissSounds.length))];
    $.ionSound.play(randomKissSound);

    // Remove the kiss element
    setTimeout(function(){
      $("#" + uniqueId).fadeOut("slow", function() {
        $(this).remove();
      });
    }, kissTimeout);
  }

  // Increment kisses, streak and update score
  function countKiss() {
    kisses++;
    if (lastClickTimer < streakTimeout) {
      currentStreak++;  
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }

    $("#kissCount").html(kisses);
    updateStreak();
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
    lastClickTime = new Date().getTime();
    createKiss(e.offsetX, e.offsetY);

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

        if (i.hasOwnProperty('longestStreak') && i.longestStreak < longestStreak) {
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

  function updateStreak() {
    $("#longestStreakCount").html(longestStreak);
    $("#currentStreakCount").html(currentStreak);

    if (longestStreak == currentStreak) {
      $("#longestStreakCount").addClass("green");
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

  $("#pomolink").click(function() {
    applyAchievement(8);
  });

  $("#japan").click(function() {
    pixelate(5);
  });

  $("#merica").click(function() {
    pixelate(25);
  });

});
