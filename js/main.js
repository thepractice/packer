$(document).ready(function() {

  var rect_array = generateRects(10);

  console.log(rect_array);

  drawPixi();

});


generateRects = function(n) {
  var rect_array = [];
  for (var i=0; i<n; i++) {
    var w = Math.round(Math.random() * 100);
    var h = Math.round(Math.random() * 100);
    var rect = {width: w, height: h};
    console.log(rect);
    rect_array.push(rect);
  }
  return rect_array;
}

drawPixi = function() {
  var renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height());
  document.body.appendChild(renderer.view);
  var stage = new PIXI.Container();
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(5, 0xFFFF00);

  var x_origin = renderer.width / 2;
  var y_origin = renderer.height / 2;

  graphics.moveTo(x_origin, 0);
  graphics.lineTo(x_origin, renderer.height);
  graphics.moveTo(0, y_origin);
  graphics.lineTo(renderer.width, y_origin);

  graphics.drawRect(0, 0, 200, 100);
  stage.addChild(graphics);
  renderer.render(stage);
}
