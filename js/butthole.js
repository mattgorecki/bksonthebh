$(function() {
  var gameElement = $("#game");
  var kissTimeout = 1000;
  var puckerTimeout = 200;
  var kisses = 0;

  var preloads = [
    '/img/lipstick-64.png',
    '/img/perfect-butthole-relaxed.jpg',
    '/img/perfect-butthole-puckered.jpg'
  ];

  var sounds = [
    'kiss1',
    'kiss2',
    'kiss3',
    'kiss4',
    'sexytime'
  ];

  preloads.forEach(function(i){
    $('<img/>')[0].src = i;
  });

  $.ionSound({
    sounds: sounds,
    path: "sounds/"
  });

  $.ionSound.play('sexytime');
  setTimeout(function() {
    gameElement.fadeIn(3000);
  }, 3000);

  function createKiss(x,y) {
    var kiss = $("<div>&nbsp;</div>");
    var uniqueId = _.uniqueId('kiss_');

    kiss.addClass("kiss");
    kiss.attr("id", uniqueId);
    kiss.css("left", x - 32);
    kiss.css("top", y - 28);
    kiss.appendTo(gameElement);

    gameElement.removeClass("relaxed").addClass("puckered");

    setTimeout(function() {
      gameElement.removeClass("puckered").addClass("relaxed");
    }, puckerTimeout);

    var randomKissSound = sounds[Math.floor(Math.random() * (sounds.length - 1))];
    $.ionSound.play(randomKissSound);

    setTimeout(function(){
      $("#" + uniqueId).fadeOut().remove();  
    }, kissTimeout);
  }

  function countKiss() {
    kisses++;
    $("#kissCount").html(kisses);
  }
  
  $("#game").click(function(e) {
    // The butthole hath been kissed.
    createKiss(e.pageX, e.pageY);
    countKiss();
  });
});
