$(document).ready(function() {

  var dimensions_array = generateRects(10);

  packed_array = packRects(dimensions_array);

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

vertex = function(x, y) {
  this.x = x;
  this.y = y;
}

generateRects = function(n) {
  var dimensions_array = [];
  for (var i=0; i<n; i++) {
    var w = 40+ Math.round(Math.random() * 100);
    var h = 40+ Math.round(Math.random() * 100);
    //var rect = {width: w, height: h};
    //var rect = new rectangle(w, h);
    dimensions_array.push([w, h]);
  }
  return dimensions_array;
}




packRects = function(dimensions_array) {
  //var rect_array = jQuery.extend(true, [], rect_array_in);
  var rect_array = [];
  var vertex_array = [];
  for (var i=0; i<dimensions_array.length; i++) {
    var width = dimensions_array[i][0];
    var height = dimensions_array[i][1];

    if (i == 0) {
      var x = - width / 2;
      var y = height / 2;
      var r = new rectangle(x, y, width, height);
      rect_array.push(r);


/*
      r.x = - r.width / 2;
      r.y = r.height / 2;
      r.v1 = new vertex(r.x, r.y);
      r.v2 = new vertex(r.x + r.width, r.y);
      r.v3 = new vertex(r.x + r.width, r.y - r.height);
      r.v4 = new vertex(r.x, r.y - r.height);
*/
      vertex_array.push(r.v1, r.v2, r.v3, r.v4);
    }
    if (i == 1) {

      x = rect_array[0].x;
      y = rect_array[0].y + height;
      r = new rectangle(x, y, width, height);
      rect_array.push(r);
/*
      r.x = rect_array[0].x;
      r.y = rect_array[0].y + r.height;
      r.v1 = new vertex(r.x, r.y);
      r.v2 = new vertex(r.x + r.width, r.y);
      r.v3 = new vertex(r.x + r.width, r.y - r.height);
      r.v4 = new vertex(r.x, r.y - r.height);
*/
      var sharedVertex = findSharedVertex(rect_array, vertex_array);

      vertex_array.push(r.v1, r.v2, r.v3, r.v4);

      usedCorners = [];
      // start array of available corners
      corners = [];
      corners = findCorners(sharedVertex, vertex_array, usedCorners);
      // start array of used corners
      usedCorners.push(sharedVertex);

    }

    if (i >= 2) {

      corners.sort(function(a, b) {
        return a.distance - b.distance;
      });
      overlap = true;

      var counter = 0;
      for (var j=0; j<corners.length; j++) {
        var nearestCorner = corners[j];
       // counter++;

        //var nearestCorner = findClosestCorner(corners);

        // Try quadrant 1 convexity
        x = nearestCorner.x;
        y = nearestCorner.y + height;
        r = new rectangle(x, y, width, height);
        var overlap = checkOverlap(r, rect_array);
        if (!overlap) {
          break;
        } else {
          // Try quadrant 2
          x = nearestCorner.x - width;
          y = nearestCorner.y + height;
          r = new rectangle(x, y, width, height);
          overlap = checkOverlap(r, rect_array);
          if (!overlap) {
            break;
          } else {
            // try quadrant 3
            x = nearestCorner.x - width;
            y = nearestCorner.y;
            r = new rectangle(x, y, width, height);
            overlap = checkOverlap(r, rect_array);
            if (!overlap) {
              break;
            } else {
              // try quadrant 4
              x = nearestCorner.x;
              y = nearestCorner.y;
              r = new rectangle(x, y, width, height);
              overlap = checkOverlap(r, rect_array);

              if (!overlap) {


                break;
              } else {
                if (j == corners.length - 1) {
                  alert('failure');
                }

              }
            }
          }
        }


      }





      rect_array.push(r);

      // remove this corner from array of available corners
      var index = corners.indexOf(nearestCorner);

      console.log('spliced');
      console.log(corners[index]);
     // corners.splice(index, 1);
      console.log('corners after splice');
      console.log(corners);


      // add this corner to array of used corners
      usedCorners.push(nearestCorner);


      sharedVertex = nearestCorner;
      vertex_array.push(r.v1, r.v2, r.v3, r.v4);
      var newCorners = findCorners(sharedVertex, vertex_array, usedCorners);

      console.log('pre push');
      console.log(corners);
      for (var j=0; j<newCorners.length; j++) {

        corners.push(newCorners[j]);
        console.log('pushed');
        console.log(newCorners[j]);
      }


    }

/*
    if (i == 3) {
      //console.log(corners);
      nearestCorner = findClosestCorner(corners);
     // console.log(nearestCorner);

      // remove this corner from array of available corners
      var index = corners.indexOf(nearestCorner);
      corners.splice(index, 1);

      // add this corner to array of used corners
      usedCorners.push(nearestCorner);

      // Try quadrant 1 convexity
      r.x = nearestCorner.x;
      r.y = nearestCorner.y + r.height;
      r.x2 = r.x + r.width;
      r.y2 = r.y - r.height;

      r.v1 = new vertex(r.x, r.y);
      r.v2 = new vertex(r.x + r.width, r.y);
      r.v3 = new vertex(r.x + r.width, r.y - r.height);
      r.v4 = new vertex(r.x, r.y - r.height);


      var overlap = checkOverlap(r, rect_array.slice(0, i));

    }
    */

  }

  return rect_array;
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

findSharedVertex = function(rect_array, vertex_array) {
  var lastRect = rect_array[rect_array.length - 1];
  var newVertices = [lastRect.v1, lastRect.v2, lastRect.v3, lastRect.v4];
  // For each new vertex, See if vertex already exists
  for (var i=0; i<newVertices.length; i++) {
    var commonVertex = vertex_array.filter(function(obj) {
      if (obj.x == newVertices[i].x) {
        if (obj.y == newVertices[i].y) {
          return true;
        }
      }
    });
  }
  return commonVertex[0];
}

findCorners = function(sharedVertex, vertex_array, usedCorners) {

  new_corners = [];
  var commonX = vertex_array.filter(function(obj) {
    if (obj.x == sharedVertex.x) {
      if (obj.y != sharedVertex.y) {
        return true;
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

findClosestCorner = function(vertex_array) {
  var min = 99999999;
  var closest = {};
  for (var i=0; i<vertex_array.length; i++) {
    if (vertex_array[i].distance < min) {
      min = vertex_array[i].distance;
      closest = vertex_array[i];
    }
  }
  return closest;
}

sortByDistance = function(vertex_array) {
  vertex_array.sort(function(a, b) {
    if(a.distance > b.distance) return -1;
    if(a.distance < b.distance) return 1;
    return 0;
  });
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

  console.log('corners final');
  console.log(corners);
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


  //graphics.drawRect(rect_array[0].x, rect_array[0].y, rect_array[0].width, rect_array[0].height);

  //renderer.render(stage);
  animate();
}

animate = function() {
  requestAnimationFrame(animate);

  renderer.render(stage);
}
