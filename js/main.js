$(document).ready(function() {

  var rect_array = generateRects(10);

  packed_array = packRects(rect_array);

  conv_array = convertCoords(packed_array, $(window).width(), $(window).height());

  drawPixi(conv_array);


});

generateRects = function(n) {
  var rect_array = [];
  for (var i=0; i<n; i++) {
    var w = 10+ Math.round(Math.random() * 100);
    var h = 10+ Math.round(Math.random() * 100);
    var rect = {width: w, height: h};
    rect_array.push(rect);
  }
 // console.log(rect_array);
  return rect_array;
}


packRects = function(rect_array_in) {
  var rect_array = jQuery.extend(true, [], rect_array_in);
  var vertex_array = [];
  for (var i=0; i<rect_array.length; i++) {
    var r = rect_array[i];
    if (i == 0) {
      r.x = - r.width / 2;
      r.y = r.height / 2;
      r.c1 = [x, y];
      r.c2 = [x + r.width, y];
      r.c3 = [x + r.width, y - r.height];
      r.c4 = [x, y - r.height];
      vertex_array.push(r.c1, r.c2, r.c3, r.c4);
    }
    if (i == 1) {
      r.x = rect_array[0].x;
      r.y = rect_array[0].y + r.height;
      r.c1 = [x, y];
      r.c2 = [x + r.width, y];
      r.c3 = [x + r.width, y - r.height];
      r.c4 = [x, y - r.height];

    }

    if (i == 2) {

      findSharedVertex(rect_array.slice(0, i));
    }
  }
//  console.log(rect_array);
  return rect_array;
}

findSharedVertex = function(rect_array) {
  var lastRect = rect_array[rect_array.length - 1];



}

convertCoords = function(rect_array_in, renderer_width, renderer_height) {
  var rect_array = jQuery.extend(true, [], rect_array_in);
  for (var i=0; i<rect_array.length; i++) {
    var r = rect_array[i];
    r.x = (r.x / renderer_width) * renderer_width + renderer_width / 2;
    r.y = - (r.y / renderer_height) * renderer_height  + renderer_height / 2;
  }

  return rect_array;
}

drawPixi = function(rect_array) {
  var renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height());
  document.body.appendChild(renderer.view);
  var stage = new PIXI.Container();
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(2, 0xFFFF00);
  graphics.beginFill(0xFFFF00);

  var x_origin = renderer.width / 2;
  var y_origin = renderer.height / 2;

  graphics.moveTo(x_origin, 0);

  graphics.lineTo(x_origin, renderer.height);
  graphics.moveTo(0, y_origin);

  graphics.lineTo(renderer.width, y_origin);

  for (var i=0; i<rect_array.length; i++) {
    var r = rect_array[i];
    graphics.beginFill(0x1099bb);
    graphics.drawRect(r.x, r.y, r.width, r.height);
  }

  //graphics.drawRect(rect_array[0].x, rect_array[0].y, rect_array[0].width, rect_array[0].height);
  stage.addChild(graphics);
  renderer.render(stage);
}

