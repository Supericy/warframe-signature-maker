function dragMove() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.dragMove(result.window.id);
    }
  });
};

function closeWindow() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.close(result.window.id);
    }
  });
};

function openSubWindow() {
  //alert("the subwindow will only be visible inside a game");
  overwolf.windows.obtainDeclaredWindow("SubWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        console.log(result);
      });
    }
  });
};

function takeScreenshot() {
  overwolf.media.takeScreenshot(function(result) {
    if (result.status == "success") {
      var img = document.getElementById("screenshot");
      img.src = result.url;
      img.onload = function() {
        overwolf.media.shareImage(img, "Screen Shot");
      };
    }
  });
}

$.fn.extend({

  insertImage: function(img, trait) {
    return this.each(function() {
      var layer = {
        type: 'image',
        name: img.src + new Date().getTime(),
        draggable: true,
        source: img.src,
        x: $canvas.width() / 2,
        y: $canvas.height() / 2,
        width: img.width,
        height: img.height,
        opacity: 1,
        handlePlacement: 'corners&rotational',
        handle: {
          type: 'arc',
          strokeStyle: '#c33',
          strokeWidth: 2,
          radius: 5
        },
        dragstart: function(layer) {
          // code to run when dragging starts
          layer.dragstartx = layer.x;
          layer.dragstarty = layer.y;
          layer.mousedown(layer);
        },
        dragstop: function(layer) {
          // code to run when dragging starts
          var dragstopx = layer.x;
          var dragstopy = layer.y;
          // pointlessly copy oh wait makes it work
          var dragstartx = layer.dragstartx;
          var dragstarty = layer.dragstarty;
          console.log("values before undo are ", layer.dragstartx, layer.dragstarty);
          $canvas.undoManager.add({
            undo: function() {
              console.log("undoing drag start  on ");
              console.log("layer before moving in undo", layer);
              console.log("values as i undo are ", dragstartx, dragstarty);
              $canvas.setLayer(layer.name, {
                x: dragstartx,
                y: dragstarty
              }).drawLayers();
              console.log("layer after undo:", layer);
            },
            redo: function() {
              console.log("restoring drag stop");
              $canvas.setLayer(layer.name, {
                x: dragstopx,
                y: dragstopy
              }).drawLayers();

            }
          });
          layer.mousedown(layer);

        },
        handlestart: function(layer) {
          // code to run when resizing starts
          console.log("STARTED RESIZING");
          layer.oldheight = layer.height;
          layer.oldwidth = layer.width;
          layer.oldx = layer.x;
          layer.oldy = layer.y;

        },

        handlestop: function(layer) {
          // code to run when resizing stops
          console.log("STOPPED RESIZING");
          var newheight = layer.height;
          var newwidth = layer.width;
          var newx = layer.x;
          var newy = layer.y;

          var oldheight = layer.oldheight;
          var oldwidth = layer.oldwidth;
          var oldx = layer.oldx;
          var oldy = layer.oldy;
          console.log(newwidth, newheight);
          $canvas.undoManager.add({
            undo: function() {
              console.log("restoring old stuff");
              $canvas.setLayer(layer.name, {
                x: oldx,
                y: oldy,
                width: oldwidth,
                height: oldheight
              }).drawLayers();
            },
            redo: function() {
              console.log("restoring new stuff");
              $canvas.setLayer(layer.name, {
                x: newx,
                y: newy,
                width: newwidth,
                height: newheight
              }).drawLayers();
            }
          });
          layer.mousedown(layer);
        },
        rotatehandlestart: function(layer) {
          // code to run when rotation starts
          console.log("STARTED ROTATING");
          layer.oldangle = layer.rotate;
          layer.oldhandlex = layer._handles[4].x;
          layer.oldhandley = layer._handles[4].y;

        },
        rotatehandlestop: function(layer) {
          // code to run when rotation stops
          console.log("STOPPED ROTATING");
          var newangle = layer.rotate;
          var newhandlex = layer._handles[4].x;
          var newhandley = layer._handles[4].y;

          var oldangle = layer.oldangle;
          var oldhandlex = layer.oldhanlex;
          var oldhandley = layer.oldhandley;
          $canvas.undoManager.add({
            undo: function() {
              $canvas.setLayer(layer.name, {
                rotate: oldangle,
              }).drawLayers();

            },
            redo: function() {
              $canvas.setLayer(layer.name, {
                rotate: newangle,
              }).drawLayers();
            }
          });
          layer.mousedown(layer);

        },
        mousedown: function(layer) {
          var previouslySelectedLayer = $canvas.selectedLayer;

          console.log("You selected " + layer.name);
          $canvas.selectedLayer = layer;

          //clear previous "selection"
          if (previouslySelectedLayer) {
            $canvas.enableLayerHandles(previouslySelectedLayer, false);
          }

          // "select" new guy
          $canvas.enableLayerHandles(layer, true);

          $("#name-toolbar").hide('fade', 250);

          // set opacity slider position
          $('#opacitySlider').slider('value', 100 - 100 * layer.opacity);

        }

      };


      /* test if its background */
      if (trait === "background") {






        layer.width = 600;
        layer.height = 200;

        layer.draggable = false;

        layer.groups = ['background'];
        // remove any old backgrounds
        $canvas.removeLayerGroup('background');
        $canvas.addLayer(layer);
        // move background to end
        $canvas.moveLayer(layer.name, 0);
        // hide handles
        $canvas.enableLayerHandles(layer, false);

        $canvas.drawLayers();
      } else {



        $canvas.addLayer(layer);

      }
      // select it after placing it.
      $canvas.drawLayers();
      layer.mousedown(layer);

      console.log(layer.x, layer.y);









    });

  },

  toggleText: function(img) {
    var spanId = $(img).attr("id");
    var style = textEffectStyles[$(img).data('text-style')];

    return this.each(function() {

      var username = localStorage.getItem("username");
      // FOR TESTING PURPOSES
      if(username){}else{username="Supericy"};

      if ($canvas.getLayer("usernameText") !== undefined) {
        $canvas.setLayer("usernameText", {
          //fontFamily: $(span).css("font-family")
          source: createTextEffect(username, style, "Arial")
        });
        $canvas.drawLayers();




      } else {
        // default size for username text (pixels);
        var INITIAL_NAME_WIDTH = 300;
        var INITIAL_NAME_HEIGHT = 100;

        $('#workspaceCanvas').addLayer({
            type: 'image',
            //fillStyle: $(span).css("color"),
            //fontFamily: $(span).css("font-family"),
            //text: username,
            name: "usernameText",
            draggable: true,
            type: 'image',
            source: createTextEffect(username, style),
            x: $canvas.width() / 2,
            y: $canvas.height() / 2,
            width: INITIAL_NAME_WIDTH,
            height: INITIAL_NAME_HEIGHT,
            opacity: 1,
            handlePlacement: 'corners&rotational',
            handle: {
              type: 'arc',
              strokeStyle: '#c33',
              strokeWidth: 2,
              radius: 5



            },
            dragstart: function(layer) {
              // code to run when dragging starts
              layer.dragstartx = layer.x;
              layer.dragstarty = layer.y;
            },
            dragstop: function(layer) {
              // code to run when dragging starts
              var dragstopx = layer.x;
              var dragstopy = layer.y;
              // pointlessly copy oh wait makes it work
              var dragstartx = layer.dragstartx;
              var dragstarty = layer.dragstarty;

              $canvas.undoManager.add({
                undo: function() {
                  console.log("undoing drag start");
                  console.log("old values are ", layer.dragstartx, layer.dragstarty);
                  $canvas.setLayer(layer.name, {
                    x: dragstartx,
                    y: dragstarty
                  }).drawLayers();
                },
                redo: function() {
                  console.log("restoring drag stop");
                  $canvas.setLayer(layer.name, {
                    x: dragstopx,
                    y: dragstopy
                  }).drawLayers();

                }
              });
              layer.mousedown(layer);

            },
            handlestart: function(layer) {
              // code to run when resizing starts
              layer.oldheight = layer.height;
              layer.oldwidth = layer.width;
              layer.oldx = layer.x;
              layer.oldy = layer.y;
            },

            handlestop: function(layer) {
              // code to run when resizing stops
              var newheight = layer.height;
              var newwidth = layer.width;
              var newx = layer.x;
              var newy = layer.y;

              var oldheight = layer.oldheight;
              var oldwidth = layer.oldwidth;
              var oldx = layer.oldx;
              var oldy = layer.oldy;


              $canvas.undoManager.add({
                undo: function() {
                  console.log("restoring old stuff");
                  $canvas.setLayer(layer.name, {
                    x: oldx,
                    y: oldy,
                    width: oldwidth,
                    height: oldheight
                  }).drawLayers();
                },
                redo: function() {
                  console.log("restoring new stuff");
                  $canvas.setLayer(layer.name, {
                    x: newx,
                    y: newy,
                    width: newwidth,
                    height: newheight
                  }).drawLayers();
                }
              });
              layer.mousedown(layer);

            },
            rotatehandlestart: function(layer) {
              // code to run when rotation starts
              layer.oldangle = layer.rotate;
              layer.oldhandlex = layer._handles[4].x;
              layer.oldhandley = layer._handles[4].y;

            },
            rotatehandlestop: function(layer) {
              // code to run when rotation stops
              var newangle = layer.rotate;
              var newhandlex = layer._handles[4].x;
              var newhandley = layer._handles[4].y;

              var oldangle = layer.oldangle;
              var oldhandlex = layer.oldhanlex;
              var oldhandley = layer.oldhandley;
              $canvas.undoManager.add({
                undo: function() {
                  $canvas.setLayer(layer.name, {
                    rotate: oldangle,
                  }).drawLayers();
                  /*
                  $canvas.setLayer($canvas.getLayer($canvas.getLayer(layer.name)._handles[4]).name, {
                      x:oldhandlex,
                      y:oldhandley
                  }).drawLayers();
                  */
                },
                redo: function() {
                  $canvas.setLayer(layer.name, {
                    rotate: newangle,
                  }).drawLayers();
                  /*
                  $canvas.setLayer($canvas.getLayer(layer._handles[4].name), {
                      x:newhandlex,
                      y:newhandley
                  }).drawLayers();
                  */
                }
              });
              layer.mousedown(layer);

            },

            mousedown: function(layer) {
              var previouslySelectedLayer = $canvas.selectedLayer;

              console.log("You selected " + layer.name);
              $canvas.selectedLayer = layer;

              //clear previous "selection"
              if (previouslySelectedLayer) {
                $canvas.enableLayerHandles(previouslySelectedLayer, false);
              }

              // "select" new guy
              $canvas.enableLayerHandles(layer, true);

              $("#name-toolbar").show('fade', 250);

              // set opacity slider position
              $('#opacitySlider').slider('value', 100 - 100 * layer.opacity);
            }

          })
          .drawLayers();

        // set layer to selected.
        layer = $canvas.getLayer("usernameText");
        layer.mousedown(layer);
      }






    });
  },

  addStat: function(text) {
    return this.each(function() {



    });
  },



  insertRect: function(x, y, width, height, fill, stroke, strokeWidth, name) {
    return this.each(function() {


      var layer = {
        type: 'rectangle',
        draggable: false,
        name,
        name,
        fillStyle: fill,
        x: x + width / 2,
        y: y + height / 2,
        width: width,
        height: height,
        strokeStyle: stroke,
        strokeWidth: strokeWidth
      };

      // Add rectangle layer w/o drawing
      $canvas.addLayer(layer)
        .drawLayers();
    });
  },

  drawHollowRect: function(x, y, width, height, stroke, strokewidth, name) {
    return this.each(function() {

      $('#workspaceCanvas').addLayer({
          type: 'line',
          name: name,
          draggable: false,
          intangible: true,
          strokeStyle: stroke,
          strokeWidth: strokewidth,
          rounded: true,
          x1: x,
          y1: y,
          x2: x,
          y2: y + height,
          x3: x + width,
          y3: y + height,
          x4: x + width,
          y4: y,
          x5: x,
          y5: y

        })
        .drawLayers();

    })
  },

  enableLayerHandles: function(layer, enabled) {
    if (layer) {
      layer = $canvas.getLayer(layer.name);
      if (layer) {
        return this.each(function(elm) {

          $canvas.setLayerGroup(layer._handles, {
            visible: enabled
          });

          var background = $canvas.getLayerGroup("background");

          if (background) {
            $canvas.setLayerGroup(background[0]._handles, {
              visible: false
            });
          }

          // Don't forget to render the changes on the canvas!
          $canvas.drawLayers();
        });
      }
    }
  }



});

$(document).ready(function() {

  $canvas = $('#workspaceCanvas');

  // undo manager
  var btnUndo,
    btnRedo;

  $canvas.undoManager = new UndoManager();

  btnUndo = document.getElementById("undo");
  btnRedo = document.getElementById("redo");

  btnUndo.onclick = function() {
    console.log("UNDOING");
    $canvas.undoManager.undo();
  };
  btnRedo.onclick = function() {
    console.log("REDOING");
    $canvas.undoManager.redo();
  };



  $("#tabs").tabs({
    hide: {
      effect: "fadeOut",
      duration: 200
    },
    show: {
      effect: "fadeIn",
      duration: 300
    },
    beforeActivate: function() {
      // toggleDoors(true);
    }
  });




  setTimeout(function() {
    //alert("Please Login to Warface To Begin Creating Your Signature.");
    toggleDoors(false);
  }, 0);






  $("#bg-list img").click(function() {

    $canvas.insertImage(this, "background");
    var image = this;
    var layer = $canvas.selectedLayer;

    $canvas.undoManager.add({
      undo: function() {
        deleteLayer(layer);
      },
      redo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = layer;
        $canvas.enableLayerHandles($canvas.selectedLayer, true);
      }
    });

  });

  $("#weapon-list img").click(function() {

    $canvas.insertImage(this);
    var image = this;
    var layer = $canvas.selectedLayer;
    $canvas.undoManager.add({
      undo: function() {
        deleteLayer(layer);
      },
      redo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = layer;
      }
    });

  });
  $("#extras-list img").click(function() {

    $canvas.insertImage(this);
    var image = this;
    var layer = $canvas.selectedLayer;
    $canvas.undoManager.add({
      undo: function() {
        deleteLayer(layer);
      },
      redo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = layer;
      }
    });

  });

  // terrible stats thing

  $("#stats-list td").click(function() {

    $canvas.addStat("Testing");

  });


  registerHooksForToolbar($canvas.undoManager);


  
  var username = localStorage.getItem("username");
  //TESTING PURPOSES
  if(username){}else{username="Supericy"};

  // setup text samples

  $('.text-style-preset').each(function() {
    var $this = $(this);
    var style = textEffectStyles[$this.data('text-style')];
    $this.attr('src', createTextEffect(username, style));
    $this.click(function() {
      createElementsFromStyle(style);
    });
  });

  $('.stat-icon-preset').each(function () {
      var $this = $(this);
      var type = STAT_TYPES[$this.data('stat-type')];
      var value = $this.data('stat-value')

      createStatIconImage(type, value, function (dataUrl) {
          $this.attr('src', dataUrl);
          $this.click(function () {
              $canvas.insertImage($this[0]);
          })
          // todo: onclick insert
      })
  });



  $("#name-list img").click(function() {
    $canvas.toggleText(this);
    var image = this;
    image.src = createTextEffect();
    var layer = $canvas.selectedLayer;
    // doStuff();
    $canvas.undoManager.add({
      undo: function() {
        deleteLayer(layer);
      },
      redo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = layer;
        // doStuff();
      }
    });
  });



  $("#name-toolbar").hide();
  $("#statsToolbar").hide();



  $("#shareTab").click(function() {
    // hide any layer handles & clear selection
    var layer = $canvas.selectedLayer;
    if (layer) {
      $canvas.selectedLayer = null;
      $canvas.enableLayerHandles(layer, false);
    }
    //showMySignature();
    $(".signatureCopy").hide('fade', 250);
    $(".signatureUploadFailed").hide('fade', 250);

  });
  $(".signatureCopy").hide('fade', 250);



});


function uploadSignatureAndShowLinks(){
  //send the signature to server
   var instructions = "";

  instructions = $canvas.getLayers().slice(0).reverse();
  //console.log(instructions);
  console.log("serializing canvas");
  var serializedCanvas = serializeCanvas();
  console.log("serialized canvas:", serializedCanvas);

  // send msg to server
  console.log("contacting server");
  $.ajax({
    type: "POST",
    //url: "http://107.170.105.215:8888/warface/sigs/upload?userId=" + "bill", /* THIS NEEDS TO BE THE USER ID */
    url: "http://localhost:8888/warface/sigs/upload?userId=" + localStorage.getItem("username"),
    data: JSON.stringify(serializedCanvas),
    success: function(data) {
      console.log(data);
      if (data) {
        showMySignatureLinks();
        return console.log("SUCCESS Connection, signature sent to server");
      } else {
        return console.log("Data isn't available");
      }
    },
    error: function(data) {
      //showFailedToUploadSignature();
      showMySignatureLinks();
      return console.log("ERROR Connection");
    }
  });

}

function showFailedToUploadSignature() {
  $(".signatureUploadFailed").show('fade', 250);
  $(".signatureCopy").hide('fade', 250);
}

function showMySignatureLinks(){
    $(".signatureCopy").show('fade', 250);
    $(".signatureUploadFailed").hide('fade', 250);
    //$("#SignatureId").attr("src", "http://localhost/warface/sigs/show?userId=" + localStorage.getItem("username"));
    //$("#SignatureId").show();

    $("#SignatureHTML").val('<a href="http://www.overwolf.com/?utm_source=forums&utm_medium=signatures&utm_campaign=signature%2Bin%2Bforums"><img alt="Warface Signature" src="http://localhost/warface/sigs/show?userId=" + localStorage.getItem("username") style="border: none;"></a>')
    $("#SignatureBBCode").val('[url=http://www.overwolf.com/?utm_source=forums&utm_medium=signatures&utm_campaign=signature%2Bin%2Bforums][img]"http://localhost/warface/sigs/show?userId=" + localStorage.getItem("username")[/img][/url]')
    $("#SignatureImageLink").val('<img alt="Warface Signature" src="http://localhost/warface/sigs/show?userId=" + localStorage.getItem("username") style="border:none;">')



}


function copyHtmlSig()
{
    overwolf.utils.placeOnClipboard(document.querySelector('#SignatureHTML').value);
}

function copyBBCodeSig()
{
    overwolf.utils.placeOnClipboard(document.querySelector('#SignatureBBCode').value);
}

function copyImageSig()
{
    overwolf.utils.placeOnClipboard(document.querySelector('#SignatureImageLink').value);
}







function serializeCanvas() {
  var canvasLayers = $canvas.getLayers().slice(0);
  var serialized = [];
  for (var n = 0; n < canvasLayers.length; n += 6) // += 6 to dodge the handles.
  {
    serialized.push(serializeLayer(canvasLayers[n]));
  }
  return serialized;
}

function serializeLayer(layer) {
  var sLayer = {};

  sLayer.name = layer.name;
  sLayer.width = layer.width;
  sLayer.height = layer.height;
  sLayer.type = layer.type;
  sLayer.draggable = layer.draggable;
  sLayer.source = layer.source;
  sLayer.x = layer.x;
  sLayer.y = layer.y;
  sLayer.translateX = layer.translateX;
  sLayer.translateY = layer.translateY;
  sLayer.opacity = layer.opacity;
  sLayer.rotate = layer.rotate;
  sLayer.scaleX = layer.scaleX;
  sLayer.scaleY = layer.scaleY;
  return sLayer;

}

function unserializeLayer(sLayer) {
  console.log("unserializing: ", sLayer);
  var layer = {
    type: sLayer.type,
    name: sLayer.name,
    draggable: sLayer.draggable,
    source: sLayer.source,
    x: sLayer.x,
    y: sLayer.y,
    width: sLayer.width,
    height: sLayer.height,
    opacity: sLayer.opacity,
    translateX: sLayer.translateX,
    translateY: sLayer.translateY,
    scaleY: sLayer.scaleY,
    scaleX: sLayer.scaleX,
    rotate: sLayer.rotate,
    handlePlacement: 'corners&rotational',
    handle: {
      type: 'arc',
      strokeStyle: '#c33',
      strokeWidth: 2,
      radius: 5
    },
    dragstart: function(layer) {
      // code to run when dragging starts
      layer.dragstartx = layer.x;
      layer.dragstarty = layer.y;
      layer.mousedown(layer);
    },
    dragstop: function(layer) {
      // code to run when dragging starts
      var dragstopx = layer.x;
      var dragstopy = layer.y;
      // pointlessly copy oh wait makes it work
      var dragstartx = layer.dragstartx;
      var dragstarty = layer.dragstarty;
      console.log("values before undo are ", layer.dragstartx, layer.dragstarty);
      $canvas.undoManager.add({
        undo: function() {
          console.log("undoing drag start  on ");
          console.log("layer before moving in undo", layer);
          console.log("values as i undo are ", dragstartx, dragstarty);
          $canvas.setLayer(layer.name, {
            x: dragstartx,
            y: dragstarty
          }).drawLayers();
          console.log("layer after undo:", layer);
        },
        redo: function() {
          console.log("restoring drag stop");
          $canvas.setLayer(layer.name, {
            x: dragstopx,
            y: dragstopy
          }).drawLayers();

        }
      });
      layer.mousedown(layer);

    },
    handlestart: function(layer) {
      // code to run when resizing starts
      console.log("STARTED RESIZING");
      layer.oldheight = layer.height;
      layer.oldwidth = layer.width;
      layer.oldx = layer.x;
      layer.oldy = layer.y;

    },

    handlestop: function(layer) {
      // code to run when resizing stops
      console.log("STOPPED RESIZING");
      var newheight = layer.height;
      var newwidth = layer.width;
      var newx = layer.x;
      var newy = layer.y;

      var oldheight = layer.oldheight;
      var oldwidth = layer.oldwidth;
      var oldx = layer.oldx;
      var oldy = layer.oldy;
      console.log(newwidth, newheight);
      $canvas.undoManager.add({
        undo: function() {
          console.log("restoring old stuff");
          $canvas.setLayer(layer.name, {
            x: oldx,
            y: oldy,
            width: oldwidth,
            height: oldheight
          }).drawLayers();
        },
        redo: function() {
          console.log("restoring new stuff");
          $canvas.setLayer(layer.name, {
            x: newx,
            y: newy,
            width: newwidth,
            height: newheight
          }).drawLayers();
        }
      });
      layer.mousedown(layer);
    },
    rotatehandlestart: function(layer) {
      // code to run when rotation starts
      console.log("STARTED ROTATING");
      layer.oldangle = layer.rotate;
      layer.oldhandlex = layer._handles[4].x;
      layer.oldhandley = layer._handles[4].y;

    },
    rotatehandlestop: function(layer) {
      // code to run when rotation stops
      console.log("STOPPED ROTATING");
      var newangle = layer.rotate;
      var newhandlex = layer._handles[4].x;
      var newhandley = layer._handles[4].y;

      var oldangle = layer.oldangle;
      var oldhandlex = layer.oldhanlex;
      var oldhandley = layer.oldhandley;
      $canvas.undoManager.add({
        undo: function() {
          $canvas.setLayer(layer.name, {
            rotate: oldangle,
          }).drawLayers();

        },
        redo: function() {
          $canvas.setLayer(layer.name, {
            rotate: newangle,
          }).drawLayers();
        }
      });
      layer.mousedown(layer);

    },
    mousedown: function(layer) {
      var previouslySelectedLayer = $canvas.selectedLayer;

      console.log("You selected " + layer.name);
      $canvas.selectedLayer = layer;

      //clear previous "selection"
      if (previouslySelectedLayer) {
        $canvas.enableLayerHandles(previouslySelectedLayer, false);
      }

      // "select" new guy
      $canvas.enableLayerHandles(layer, true);

      $("#name-toolbar").hide();

      // set opacity slider position
      $('#opacitySlider').slider('value', 100 - 100 * layer.opacity);

    }

  };
  return layer;
}

function unserializeCanvas(serializedCanvas) {

  var unserialized = [];
  console.log(serializedCanvas[0]);
  for (var n = 0; n < serializedCanvas.length; n++) {
    unserialized.push(unserializeLayer(serializedCanvas[n]));
  }
  return unserialized;


}



function registerHooksForToolbar(undoManager) {

  $("#flipVert").click(function() {
    var layer = $canvas.selectedLayer;
    flipLayerVertical(layer);
    undoManager.add({
      undo: function() {
        flipLayerVertical(layer);
      },
      redo: function() {
        flipLayerVertical(layer);
      }
    });

  });

  $("#flipHoriz").click(function() {
    var layer = $canvas.selectedLayer;
    flipLayerHorizontal(layer);
    undoManager.add({
      undo: function() {
        flipLayerHorizontal(layer);
      },
      redo: function() {
        flipLayerHorizontal(layer);
      }
    });

  });


  $("#upLayer").click(function() {
    var layer = $canvas.selectedLayer;
    moveLayerUp(layer);
    undoManager.add({
      undo: function() {
        moveLayerDown(layer);
      },
      redo: function() {
        moveLayerUp(layer);
      }
    });

  });

  $("#downLayer").click(function() {
    var layer = $canvas.selectedLayer;
    moveLayerDown(layer);
    undoManager.add({
      undo: function() {
        moveLayerUp(layer);
      },
      redo: function() {
        moveLayerDown(layer);
      }
    });


  });


  $("#delete").click(function() {

    var layer = $canvas.selectedLayer;
    deleteLayer(layer);

    undoManager.add({
      undo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = $canvas.getLayer(layer.name);
        $canvas.enableLayerHandles($canvas.selectedLayer, true);
        console.log($canvas.selectedLayer);

      },
      redo: function() {
        deleteLayer(layer);
      }
    });

  });

  var $opacitySlider = $('#opacitySlider');
  $opacitySlider.slider({
    min: 0,
    max: 1,
    step: 0.01,
    slide: function(event, ui) {
      if ($canvas.selectedLayer) {
        setOpacity($canvas.selectedLayer, 1 - ui.value);
      }
    },
    start: function(event, ui) {
      if ($canvas.selectedLayer) {
        $canvas.selectedLayer.oldOpacity = 1 - ui.value;
      }
    },
    stop: function(event, ui) {
      if ($canvas.selectedLayer) {
        var newOpacity = 1 - ui.value;
        var oldOpacity = $canvas.selectedLayer.oldOpacity;

        undoManager.add({
          undo: function() {
            $opacitySlider.slider('value', oldOpacity);
            setOpacity($canvas.selectedLayer, oldOpacity);

          },
          redo: function() {
            $opacitySlider.slider('value', newOpacity);
            setOpacity($canvas.selectedLayer, newOpacity);
          }
        });
      }
    }
  });


}

function setOpacity(layer, value) {
  if (layer) {
    $canvas.animateLayer(layer.name, {

      opacity: value

    }, 0);
  }
}

function flipLayerVertical(layer) {
  if (layer) {
    var value = -1;
    if (layer.scaleY === -1) {
      value = 1;
    }

    $canvas.animateLayer(layer.name, {

      scaleY: value

    }, 200);
  }
}

function flipLayerHorizontal(layer) {
  if (layer) {
    var value = -1;
    if (layer.scaleX === -1) {
      value = 1;
    }

    $canvas.animateLayer(layer.name, {

      scaleX: value

    }, 200);
  }
}

function deleteLayer(layer) {
  if (layer) {
    $canvas.removeLayer(layer.name);
    $canvas.drawLayers();
    $canvas.selectedLayer = null;
  }
}

function moveLayerDown(layer) {
  if (layer) {
    if (layer.index !== 0) {
      $canvas.moveLayer(layer.name, layer.index - 6);
      $canvas.drawLayers();
    }
  }
}

function moveLayerUp(layer) {
  if (layer) {
    var numLayers = $canvas.getLayers().length;
    if (layer.index !== (numLayers - 6)) {
      $canvas.moveLayer(layer.name, (layer.index + 6));
      $canvas.drawLayers();
    }
  }

}


function toggleDoors(open) {
  // TODO: convince Bennet to keep this permanently
  $('#leftDoor, #rightDoor').hide();
  return;


  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'http://media.soundcloud.com/stream/VLWbetum1EQA.mp3');
  //audioElement.setAttribute('autoplay', 'autoplay');
  //audioElement.load()

  //$.get();



  //setTimeout(

  if (open) {

    audioElement.play();
    // function () {
    $("#leftDoor").animate({
      left: (open ? 0 : -640)
    }, 500);
    $("#rightDoor").animate({
      right: (open ? 0 : -640)
    }, 500);
    //}, 500);
  }


  setTimeout(function() {
    audioElement.setAttribute('src', 'audio/doorSound.mp3');
    audioElement.play();
    open = false;
    setTimeout(

      function() {

        $("#leftDoor").animate({
          left: (open ? 0 : -640)
        }, 1200);
        $("#rightDoor").animate({
          right: (open ? 0 : -640)
        }, 1200, function() {
          audioElement.pause()
        });


      }, 800);

  }, 1200);




}









function previewFile() {
  var imgElement = new Image();
  var file = document.querySelector('input[type=file]').files[0]; //sames as here
  var reader = new FileReader();

  reader.onloadend = function() {
    imgElement.src = reader.result;
    // create a new entry for the image
    $('#customImagesTable tr:last').after("<tr><td><img src=\"\"></td></tr>");

    $('#customImagesTable tr:last td img').attr("src", imgElement.src);

  }

  if (file) {
    reader.readAsDataURL(file); //reads the data as a URL
  } else {
    imgElement.src = "";
  }


}





function downloadCanvas(link, canvasId, filename) {
  link.href = document.getElementById(canvasId).toDataURL();
  link.download = filename;
}