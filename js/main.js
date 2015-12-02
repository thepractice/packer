$(document).ready(function() {

  var rect_array = generateRects(10);

  rect_array = packRects(rect_array);

  rect_array = convertCoords(rect_array, $(window).width(), $(window).height());

  drawPixi(rect_array);

  console.log(rect_array);

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


packRects = function(rect_array) {
  for (var i=0; i<rect_array.length; i++) {
    if (i == 0) {
      rect_array[i].x = 0;
      rect_array[i].y = 0;
    }
  }
  return rect_array;
}

convertCoords = function(rect_array, renderer_width, renderer_height) {
  var scale = 1000;
  for (var i=0; i<rect_array.length; i++) {
    rect_array[i].x = (rect_array[i].x / scale) * renderer_width + renderer_width / 2;
    rect_array[i].y = (rect_array[i].y / scale) * renderer_height + renderer_height / 2 - rect_array[i].height;
  }
  return rect_array;
}

drawPixi = function(packed_array) {
  var renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height());
  document.body.appendChild(renderer.view);
  var stage = new PIXI.Container();
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(1, 0xFFFF00);
  graphics.beginFill(0xFFFF00);

  var x_origin = renderer.width / 2;
  var y_origin = renderer.height / 2;

  graphics.moveTo(x_origin, 0);
  graphics.lineTo(x_origin, renderer.height);
  graphics.moveTo(0, y_origin);
  graphics.lineTo(renderer.width, y_origin);

  graphics.drawRect(packed_array[0].x, packed_array[0].y, packed_array[0].width, packed_array[0].height);
  stage.addChild(graphics);
  renderer.render(stage);
}
