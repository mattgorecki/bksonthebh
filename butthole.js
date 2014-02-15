$(function() {
  var myView = document.getElementById('game');
  var renderer = PIXI.autoDetectRenderer(800, 600, myView, true, true);
  var stage = new PIXI.Stage(0x000000, true);

  $("#game").click(function(e) {
    console.log(e);
  });

  var bgTexture = PIXI.Texture.fromImage("img/aladdin.jpg");
  var bg = new PIXI.Sprite(bgTexture);
  bg.position.x = 0;
  bg.position.y = 0;
  stage.addChild(bg);

  var kissTexture = PIXI.Texture.fromImage("img/lipstick.png");
  var kiss = new PIXI.Sprite(kissTexture);
  kiss.position.x = 400;
  kiss.position.y = 300;

  stage.addChild(kiss);

  requestAnimationFrame(animate);

  function animate() {
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
});
