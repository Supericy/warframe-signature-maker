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

$.fn.extend({

  insertImage: function(img, params) {
      params = params || {};
      params.isBackground = params.isBackground || false;
      params.unique = params.unique || false;
      params.name = params.name || img.src + (params.unique ? '' : new Date().getTime());
      params.style = params.style || {};

    return this.each(function() {
      var layer = {
        type: 'image',
        name: params.name,
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
          //console.log(newwidth, newheight);

          if(statsRecording.indexOf(layer.name)>=0){
            console.log(layer.source);
            console.log("beautifying");
            updateIntermediateStatIcon(layer, function(dataUrl){
              layer.source = dataUrl;
              console.log(dataUrl);
              $canvas.drawLayers();
            });



          }


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
          console.log(layer);
          $canvas.selectedLayer = layer;

          //clear previous "selection"
          if (previouslySelectedLayer) {
            $canvas.enableLayerHandles(previouslySelectedLayer, false);
          }

          // "select" new guy
          $canvas.enableLayerHandles(layer, true);

          if(params.style){
            layer.style = params.style;
          }

          if(statsRecording.indexOf(layer.name)>=0){
            $("#stat-toolbar").show('fade', 250);
            $("#name-toolbar").hide();
            updateStatToolbar();
          } else {
            $("#stat-toolbar").hide('fade', 250);
            $("#name-toolbar").hide('fade', 250);
          }

          // set opacity slider position
          $('#opacitySlider').slider('value', layer.opacity);



        }

      };

      


      /* test if its background */
      if (params.isBackground) {
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
     


      //console.log(layer);









    });

  },

  toggleText: function(img) {
    var spanId = $(img).attr("id");
    var style = textEffectStyles[$(img).data('text-style')];

    return this.each(function() {

      var username = localStorage.getItem("username");
      // FOR TESTING PURPOSES
      //if(username){}else{username="Supericy"};

      if ($canvas.getLayer("usernameText") !== undefined) {
        $canvas.setLayer("usernameText", {
          //fontFamily: $(span).css("font-family")
          source: createTextEffect(username, style)
        });
        $canvas.drawLayers();




      } else {
        // default size for username text (pixels);
        var INITIAL_NAME_WIDTH = 300;
        var INITIAL_NAME_HEIGHT = 100;

        $('#workspaceCanvas').addLayer({
            style: style,
            type: 'image',
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

              // redraw the text effect at the new dimensions
              console.log(layer.style);
              var username = localStorage.getItem("username");
              layer.source = createTextEffect(username, layer.style);



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

              $("#name-toolbar").show('fade', 250);
              $("#stat-toolbar").hide();

              // set opacity slider position
              $('#opacitySlider').slider('value', layer.opacity);
              //console.log(layer.style);
              //createElementsFromStyle(layer.style); // to do : figure out why this doesnt work
            }

          })
          .drawLayers();

        // set layer to selected.
        layer = $canvas.getLayer("usernameText");
        layer.mousedown(layer);
        $canvas.drawLayers();
      }






    });
  },
  enableLayerHandles: function(layer, enabled) {
    if (layer) {
      layer = $canvas.getLayer(layer.name);
      if (layer) {
        return this.each(function(elm) {

          $canvas.setLayerGroup(layer._handles, {
            visible: enabled
          });
          //console.log(enabled);
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
var statsRecording = ["kill","kill_in_slide","kill_headshot","kill_melee","kill_grenade","kill_headshot","defibrillator_kill","two_at_once_kill"];
$(document).ready(function() {
    // todo: unhide doors n stuff
   // $('#authWindow, #leftDoor, #rightDoor').hide();


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



  $("#bg-list img").click(function() {

    $canvas.insertImage(this, {
        isBackground: true
    });
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


  registerHooksForToolbar($canvas.undoManager);



  var username = localStorage.getItem("username");
  //TESTING PURPOSES
  //if(username){}else{username="Supericy";localStorage.setItem("username","Supericy")};

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
      var style = {
        fillStyle: tinycolor('orange'),
        strokeWidth: '2',
        strokeStyle: tinycolor('black'),
        font: {family:'Impact'},
        iconColor:tinycolor('silver')
      };
      createStatIconImage(type, value, style,function (dataUrl) {
          $this.attr('src', dataUrl);
          $this.click(function () {


              $canvas.insertImage($this[0], {
                  unique: true,
                  name: type.name,
                  style: style
              });
            //var layer = $canvas.selectedLayer;
            //$canvas.enableLayerHandles(layer, true);// stats no longer resizeable/rotatable until jsdom bug fixed.
            $canvas.undoManager.add({
              undo: function() {
                deleteLayer(layer);
                $("#stat-toolbar").hide();

              },
              redo: function() {
                $canvas.addLayer(layer).drawLayers();
                $canvas.enableLayerHandles($canvas.selectedLayer, false);
                $canvas.selectedLayer = layer;
                 $("#stat-toolbar").show();
            }
           });


          });
      });
  });



  $("#name-list img").click(function() {
    $canvas.toggleText(this);
    var layer = $canvas.selectedLayer;
    $canvas.undoManager.add({
      undo: function() {
        deleteLayer(layer);
        $("#name-toolbar").hide();
      },
      redo: function() {
        $canvas.addLayer(layer).drawLayers();
        $canvas.enableLayerHandles($canvas.selectedLayer, false);
        $canvas.selectedLayer = layer;
        $("#name-toolbar").show();
      }
    });
  });



  $("#name-toolbar").hide();
  $("#stat-toolbar").hide();



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
    $("#name-toolbar").hide('fade', 250);
    $("#stat-toolbar").hide('fade', 250);

  });
  $(".signatureCopy").hide('fade', 250);



});


function uploadSignatureAndShowLinks(){
  //send the signature to server
   var instructions = "";

  instructions = $canvas.getLayers().slice(0).reverse();
  //console.log(instructions);
  //console.log("serializing canvas");
  var serializedCanvas = serializeCanvas();
  //console.log("serialized canvas:", serializedCanvas);

  // send msg to server
  //console.log("contacting server");
  $.ajax({
    type: "POST",
    //url: "http://107.170.105.215/sigs/upload?userId=" + "bill", /* THIS NEEDS TO BE THE USER ID */
    //url: "http://localhost/sigs/upload?userId=bill", //;+ localStorage.getItem("username"),
    url: "http://warfacesigs.me/sigs/upload?userId=bill",
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
      showMySignatureLinks(); // FOR TESTING PURPOSES
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

    $("#SignatureHTML").val('<img alt="Warface Signature" src="http://warfacesigs.me/sigs/show?userId=' + localStorage.getItem("username") +'"'+'style="border: none;">');
    $("#SignatureBBCode").val('[img]"http://warfacesigs.me/sigs/show?userId=' + localStorage.getItem("username")+'"'+'[/img]');
    $("#SignatureImageLink").val('http://warfacesigs.me/sigs/show?userId=' + localStorage.getItem("username"));



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


function openHelpDialog(){

  //alert("the subwindow will only be visible inside a game");
    console.log("opening helpwindow");
  overwolf.windows.obtainDeclaredWindow("HelpWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        console.log(result);
      });
    }
  });


}

function closeCurrentWindow() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.close(result.window.id);
    }
  });
};


function serializeCanvas() {
  var canvasLayers = $canvas.getLayers().slice(0);
  var serialized = [];
  for (var n = 0; n < canvasLayers.length; n++)
  {
    if(canvasLayers[n].type ==='image'){ // best
    serialized.push(serializeLayer(canvasLayers[n]));
    }
  }
  return serialized;
}

function serializeLayer(layer) {

  console.log("style", layer.style);

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
  sLayer.groups = layer.groups;
  sLayer.style = layer.style;
  return sLayer;


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
        setOpacity($canvas.selectedLayer, ui.value);
      }
    },
    start: function(event, ui) {
      if ($canvas.selectedLayer) {
        $canvas.selectedLayer.oldOpacity = ui.value;
      }
    },
    stop: function(event, ui) {
      if ($canvas.selectedLayer) {
        var newOpacity = ui.value;
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
    layer.opacity = value;
    $canvas.drawLayers();
  }
}

function flipLayerVertical(layer) {
  if (layer) {
    var value = -1;
    if (layer.scaleY === -1) {
      value = 1;
    }
    var style = layer.style;
    $canvas.animateLayer(layer.name, {
      scaleY: value
    }, 200);
    layer.style = style;
  }
}

function flipLayerHorizontal(layer) {
  if (layer) {
    var value = -1;
    if (layer.scaleX === -1) {
      value = 1;
    }
    var style = layer.style;
    $canvas.animateLayer(layer.name, {
      scaleX: value
    }, 200);
    layer.style = style;
  }
}

function deleteLayer(layer) {
  if (layer) {
    $canvas.removeLayer(layer.name);
    $canvas.drawLayers();
    $canvas.selectedLayer = null;
    if(layer.name === "usernameText"){
                      $("#name-toolbar").hide();
    }
    if(statsRecording.indexOf(layer.name)>=0){
                      $("#stat-toolbar").hide();
    }
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


function authorizeUser() {

  
  $('#authWindow').hide('fade', 500);
  //checkIfWarfaceRunning();  // to do un comment this

  var name = localStorage.getItem('username') ;
  var running = localStorage.getItem('warfaceRunning');

  var shouldOpen = name && running;
  console.log(name);
  console.log(running);
  console.log(shouldOpen);
  if(shouldOpen || true)  //to do remove this true
  {
    console.log("the if was true");
    console.log(localStorage.getItem('username') );
  console.log(localStorage.getItem('warfaceRunning'));
    var unserializedCanvas = null;

    $.ajax({
       type:"GET",
       url: "http://warfacesigs.me/sigs/data?userId=bill", // to do make username from local storage
       success: function (data) {

           if(data)
           {

               var list = JSON.parse(data);
               list = JSON.parse(list);
               unserializedCanvas = unserializeCanvas(list);
               //console.log("unserialized canvas:", unserializedCanvas);

               //console.log("drawing on canvas");
                for (var i = 0; i < unserializedCanvas.length; i++) {
                 // console.log("adding this layer: " + JSON.stringify(unserializedCanvas[i]));
                  var layer = unserializedCanvas[i];
                  $canvas.addLayer(layer);
                  $canvas.enableLayerHandles($canvas.getLayer(layer.name), false);
                }
                $canvas.drawLayers();

               return console.log("SUCCESS Connection");
           } else {
               return console.log("No past signature for available.");
           }
       },
       error: function (data) {
           return console.log("ERROR Connection");
       }
   });



  // open doors
  $("#authWindow").hide('fade', 500);

  setTimeout(function() {
    var audioElement = document.createElement('audio');
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
          $('#leftDoor, #rightDoor').hide();
        });
        }, 400);
    }, 900);

  } else {
    $('#authWindow').show('fade', 500);
  }


}

function unserializeLayer(sLayer) {
  //console.log("unserializing: ", sLayer);
  var layer = {
    type: sLayer.type,
    name: sLayer.name,
    draggable: sLayer.draggable,
    source: sLayer.source.replace(/^.*?(?=images\/)/i, ''),
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
              if(layer.groups[0] === 'background'){}else{
              $canvas.enableLayerHandles(layer, true);}

              if(layer.name === "usernameText"){
                $("#name-toolbar").show('fade', 250);
                $("#stat-toolbar").hide();
                createElementsFromStyle(layer.style);
              } else if(statsRecording.indexOf(layer.name)>=0){
                $canvas.enableLayerHandles(layer, true);// stats no longer resizeable/rotatable until jsdom bug fixed.
                $("#stat-toolbar").show('fade', 250);
                $("#name-toolbar").hide();
                updateStatToolbar();
              } else {
                $("#stat-toolbar").hide('fade', 250);
                $("#name-toolbar").hide('fade', 250);
              }

              // set opacity slider position
              $('#opacitySlider').slider('value', layer.opacity);
            }



  };

  if(sLayer.groups){
    layer.groups = sLayer.groups.slice(0);
  }
  if(sLayer.style){
    layer.style = sLayer.style;
  }



  return layer;
}

function unserializeCanvas(serializedCanvas) {

  var unserialized = [];
  //console.log(serializedCanvas[0]);
  for (var n = 0; n < serializedCanvas.length; n++) {
    unserialized.push(unserializeLayer(serializedCanvas[n]));
  }
  return unserialized;


}
