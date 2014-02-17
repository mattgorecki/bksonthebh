$(function() {
  var gameElement = $("#game");
  var kissTimeout = 1000;
  var puckerTimeout = 200;
  var kisses = 0;

  // Preload images into hidden img tag
  var preloads = [
    '/img/lipstick-64.png',
    '/img/perfect-butthole-relaxed.jpg',
    '/img/perfect-butthole-puckered.jpg',
    '/img/perfect-butthole-puckered2.jpg'
  ];

  preloads.forEach(function(i){
    $('<img/>')[0].src = i;
  });

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

  // Load game sounds
  var sounds = [
    'kiss1',
    'kiss2',
    'kiss3',
    'kiss4'
  ];

  $.ionSound({
    sounds: sounds,
    path: "sounds/"
  });

  // Fade in the game image
  setTimeout(function() {
    gameElement.fadeIn(5000);
  }, 2000);

  // Fade in the sidebar advertisement
  setTimeout(function() {
    $("#adcontainer").show(5000);
  }, 7000);

  function createKiss(x,y) {
    var kiss = $("<div>&nbsp;</div>");
    var uniqueId = _.uniqueId('kiss_');

    kiss.addClass("kiss");
    kiss.attr("id", uniqueId);
    kiss.css("left", x - 32);
    kiss.css("top", y - 28);
    kiss.css({ WebkitTransform: 'rotate(' + randomRotation() + 'deg)'});
    kiss.appendTo(gameElement);

    gameElement.removeClass("relaxed").addClass("puckered");

    setTimeout(function() {
      gameElement.removeClass("puckered").addClass("relaxed");
    }, puckerTimeout);

    var randomKissSound = sounds[Math.floor(Math.random() * (sounds.length - 1))];
    $.ionSound.play(randomKissSound);

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

  // Menu items
  $("#help").hover(function() {
    $("#kissthebutthole").fadeIn('fast');
  }, function() {
    $("#kissthebutthole").fadeOut('slow');
  });

  $('#togglemusic').click(function() {
    if (!bgMusic.paused) {
      bgMusic.pause();
      playing = false;
    } else {
      bgMusic.play();
      playing = true;
    }
  });
  
});
