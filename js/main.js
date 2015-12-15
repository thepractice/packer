var corners = [];
var rect_array = [];
var vertex_array = [];
var usedCorners = [];

$(document).ready(function() {

  var dimensions_array = generateRects(30);

  packed_array = packRectsWrapper(dimensions_array);

  conv_array = convertCoords(packed_array, $(window).width(), $(window).height());

  drawPixi(conv_array);


});

rectangle = function(x, y, width, height) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.x2 = x + width;
  this.y2 = y - height;
  this.v1 = new vertex(x, y);
  this.v2 = new vertex(x + width, y);
  this.v3 = new vertex(x + width, y - height);
  this.v4 = new vertex(x, y - height);
}

dimension = function(width, height) {
  this.width = width;
  this.height = height;
}

vertex = function(x, y) {
  this.x = x;
  this.y = y;
}

generateRects = function(n) {
  var dimensions_array = [];
  for (var i=0; i<n; i++) {
    var w = 40+ Math.round(Math.random() * 100);
    var h = 40+ Math.round(Math.random() * 100);
    var d = new dimension(w, h);
    dimensions_array.push(d);
  }
  return dimensions_array;
}

firstTwoRect = function(dimensions_array) {

  var width1 = dimensions_array[0].width;
  var height1 = dimensions_array[0].height;
  var x1 = - width1 / 2;
  var y1 = height1 / 2;
  var r1 = new rectangle(x1, y1, width1, height1);
  var width2 = dimensions_array[1].width;
  var height2 = dimensions_array[1].height;
  var x2 = x1;
  var y2 = y1 + height2;
  var r2 = new rectangle(x2, y2, width2, height2);
  rect_array.push(r1, r2);
  vertex_array.push(r1.v1, r1.v2, r1.v3, r1.v4, r2.v1, r2.v2, r2.v3, r2.v4);

  var sharedVertex = r1.v1;
  corners = findCorners(sharedVertex, vertex_array, usedCorners);
  usedCorners.push(sharedVertex);
}

packRectsWrapper = function(dimensions_array) {

  firstTwoRect(dimensions_array);

  dimensions_array = dimensions_array.slice(2);

  for (var i=0; i<dimensions_array.length; i++) {
    var width = dimensions_array[i].width;
    var height = dimensions_array[i].height;

    corners.sort(function(a, b) {
      return a.distance - b.distance;
    });

    var indivRectInfo = packIndivRect(width, height);
    var r = indivRectInfo.rectangle;
    var corner = indivRectInfo.corner;

    usedCorners.push(corner);
    vertex_array.push(r.v1, r.v2, r.v3, r.v4);
    rect_array.push(r);
    var newCorners = findCorners(corner, vertex_array, usedCorners);
    for (var j=0; j<newCorners.length; j++) {
      corners.push(newCorners[j]);
    }
  }

  return rect_array;

}

packIndivRect = function(width, height) {
  console.log('corners');
  console.log(corners);

  for (var j=0; j<corners.length; j++) {
    var corner = corners[j];
    var quadrants = [[corner.x, corner.y + height], [corner.x - width, corner.y + height], [corner.x - width, corner.y], [corner.x, corner.y]];

    for (var k=0; k<quadrants.length; k++) {
      var x = quadrants[k][0];
      var y = quadrants[k][1];
      var r = new rectangle(x, y, width, height);
      var overlap = checkOverlap(r, rect_array);
      if (!overlap) {
        return {rectangle: r, corner: corner};
      }
    }
  }

}

checkOverlap = function(rect, rect_array) {
  var overlap = false;
  var rect2 = {};
  for (var i=0; i<rect_array.length; i++) {
    rect2 = rect_array[i];
    if (rect.v1.x < rect2.v2.x && rect.v2.x > rect2.v1.x && rect.v4.y < rect2.v1.y && rect.v1.y > rect2.v4.y) {
      overlap = true;
    }
  }
  return overlap;

}

findCorners = function(sharedVertex, vertex_array, usedCorners) {

  new_corners = [];
  var commonX = vertex_array.filter(function(obj) {
    if (obj.x == sharedVertex.x) {
      if (obj.y != sharedVertex.y) {
        var used = false;
        for (var i=0; i<usedCorners.length; i++) {
          if (obj.x == usedCorners[i].x && obj.y == usedCorners[i].y) {
            var used = true;
            break;
          }
        }
        if (!used) {
          return true;
        }
      }
    }
  });

  var distAB = Math.abs(commonX[0].y - commonX[1].y);
  var distXA = Math.abs(commonX[0].y - sharedVertex.y);
  var distXB = Math.abs(commonX[1].y - sharedVertex.y);
  // If sharedVertex is not between
  if (Math.max(distAB, distXA, distXB) != distAB) {
    if (Math.min(distXA, distXB) == distXA) {
      new_corners.push(commonX[0]);
      var thisCorner = new_corners[new_corners.length -1];
      thisCorner.convex = 5;
      thisCorner.distance = getDistance(thisCorner);
    } else {
      new_corners.push(commonX[1]);
      var thisCorner = new_corners[new_corners.length -1];
      thisCorner.convex = 5;
      thisCorner.distance = getDistance(thisCorner);
    }
  }


  var commonY = vertex_array.filter(function(obj) {
    if (obj.y == sharedVertex.y) {
      if (obj.x != sharedVertex.x) {
        // loop through all used corners and make sure vertex is not one of them
        var used = false;
        for (var i=0; i<usedCorners.length; i++) {
          if (obj.x == usedCorners[i].x && obj.y == usedCorners[i].y) {
            var used = true;
            break;
          }
        }
        if (!used) {
          return true;
        }

      }
    }
  });

  if (commonY.length < 2) {
    alert(commonY);
  }


  var distAB = Math.abs(commonY[0].x - commonY[1].x);
  var distXA = Math.abs(commonY[0].x - sharedVertex.x);
  var distXB = Math.abs(commonY[1].x - sharedVertex.x);
  // If sharedVertex is not between
  if (Math.max(distAB, distXA, distXB) != distAB) {
    if (Math.min(distXA, distXB) == distXA) {
      new_corners.push(commonY[0]);
      var thisCorner = new_corners[new_corners.length -1];
      thisCorner.convex = 4;
      thisCorner.distance = getDistance(thisCorner);
    } else {
      new_corners.push(commonY[1]);
      var thisCorner = new_corners[new_corners.length -1];
      thisCorner.convex = 1;
      thisCorner.distance = getDistance(thisCorner);
    }
  }
  return new_corners;

}

getDistance = function(vertex) {
  return Math.pow(Math.pow(vertex.x, 2) + Math.pow(vertex.y, 2), 0.5);
}

convertCoords = function(rect_array_in, renderer_width, renderer_height) {
  var rect_array = jQuery.extend(true, [], rect_array_in);
  var scale = 0.5;
  for (var i=0; i<rect_array.length; i++) {
    var r = rect_array[i];
    r.x = (r.x / renderer_width) * renderer_width + renderer_width / 2;
    r.y = - (r.y / renderer_height) * renderer_height  + renderer_height / 2;
  }

  return rect_array;
}

convertVertex = function(x, y, renderer_width, renderer_height) {
  var scale = 0.5;
  var new_x = x / renderer_width * renderer_width + renderer_width / 2;
  var new_y = - y / renderer_height * renderer_height + renderer_height / 2;
  return [new_x, new_y];
}

drawPixi = function(rect_array) {
  renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height());
  document.body.appendChild(renderer.view);
  stage = new PIXI.Container();
  var graphics = new PIXI.Graphics();

  graphics.lineStyle(2, 0xFFFF00);
  graphics.beginFill(0x1099bb);
//  graphics.beginFill(0xFFFF00);

  var x_origin = renderer.width / 2;
  var y_origin = renderer.height / 2;

  graphics.moveTo(x_origin, 0);

  graphics.lineTo(x_origin, renderer.height);
  graphics.moveTo(0, y_origin);

  graphics.lineTo(renderer.width, y_origin);

  stage.addChild(graphics);

  for (var i=0; i<rect_array.length; i++) {
    var r = rect_array[i];

   //graphics.lineStyle(2, 0x1099bb);
    graphics.drawRect(r.x, r.y, r.width, r.height);
  //  graphics.drawCircle(r.x, r.y, 6);
  }

/*
  for (var j=0; j<corners.length; j++) {
    graphics.beginFill(0x5D0776);
    var converted = convertVertex(corners[j].x, corners[j].y, renderer.width, renderer.height);


    graphics.drawCircle(converted[0], converted[1], 6);

  }


  for (var j=0; j<usedCorners.length; j++) {
    graphics.beginFill(0xEC8A49);
    var converted = convertVertex(usedCorners[j].x, usedCorners[j].y, renderer.width, renderer.height);
  //  graphics.drawCircle(converted[0], converted[1], 6);

  }
*/

  //graphics.drawRect(rect_array[0].x, rect_array[0].y, rect_array[0].width, rect_array[0].height);

  //renderer.render(stage);
  animate();
}

animate = function() {
  requestAnimationFrame(animate);

  renderer.render(stage);
}
