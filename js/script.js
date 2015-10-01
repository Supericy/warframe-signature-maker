function dragMove(){
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragMove(result.window.id);
		}
	});
};

function closeWindow(){
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.close(result.window.id);
		}
	});
};

function openSubWindow(){
	//alert("the subwindow will only be visible inside a game");
	overwolf.windows.obtainDeclaredWindow("SubWindow", function(result){
		if (result.status == "success"){
			overwolf.windows.restore(result.window.id, function(result){
					console.log(result);
			});
		}
	});
};

function takeScreenshot(){
	overwolf.media.takeScreenshot(function(result){
		if (result.status == "success"){
			var img = document.getElementById("screenshot");
			img.src = result.url;
			img.onload = function() {
				overwolf.media.shareImage(img, "Screen Shot");
			};
		}
	});
}
 
$.fn.extend({

    insertImage: function (img, trait) {
        return this.each(function () {
            
            var layer = {
                type: 'image',
                name: img.src + new Date().getTime(),
                draggable: true,
                source: img.src,
                x: $canvas.width() / 2,
                y: $canvas.height() / 2,
                width: img.width,
                height: img.height,
                handlePlacement: 'corners&rotational',
                handle: {
                    type: 'arc',
                    strokeStyle: '#c33',
                    strokeWidth: 2,
                    radius: 5


                },
                   dragstart: function (layer) {
                    // code to run when dragging starts
                        layer.dragstartx = layer.x;
                        layer.dragstarty = layer.y;
                    },
                    dragstop: function (layer){
                    // code to run when dragging starts
                        var dragstopx = layer.x;
                        var dragstopy = layer.y;
                        // pointlessly copy oh wait makes it work
                        var dragstartx = layer.dragstartx;
                        var dragstarty = layer.dragstarty;
                        console.log( "values before undo are ", layer.dragstartx, layer.dragstarty);
                        $canvas.undoManager.add({
                            undo:function(){
                                console.log("undoing drag start  on ");
                                console.log("values as i undo are ", dragstartx, dragstarty);
                                $canvas.setLayer(layer, {
                                    x:dragstartx,
                                    y:dragstarty
                                }).drawLayers();               
                            },
                            redo:function(){
                                console.log("restoring drag stop");
                                $canvas.setLayer(layer, {
                                    x:dragstopx,
                                    y:dragstopy
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
                    console.log(newwidth,newheight);
                    $canvas.undoManager.add({
                        undo:function(){
                            console.log("restoring old stuff");
                            $canvas.setLayer(layer, {
                                x:oldx,
                                y:oldy,
                                width:oldwidth,
                                height:oldheight
                            }).drawLayers();              
                        },
                        redo:function(){
                            console.log("restoring new stuff");
                            $canvas.setLayer(layer, {
                                x:newx,
                                y:newy,
                                width:newwidth,
                                height:newheight
                            }).drawLayers();              
                        }
                    });
                    layer.mousedown(layer);
                    },
                    rotatehandlestart:function(layer)
                    {
                    // code to run when rotation starts
                    console.log("STARTED ROTATING");
                    layer.oldangle = layer.rotate;
                    layer.oldhandlex = layer._handles[4]._endX;
                    layer.oldhandley = layer._handles[4]._endY;

                    },
                    rotatehandlestop: function(layer)
                    {
                    // code to run when rotation stops
                    console.log("STOPPED ROTATING");
                    var newangle = layer.rotate;
                    var newhandlex = layer._handles[4]._endX;
                    var newhandley = layer._handles[4]._endY;

                    var oldangle = layer.oldangle;
                    var oldhandlex = layer.oldhanlex;
                    var oldhandley = layer.oldhandley;
                    $canvas.undoManager.add({
                        undo:function(){
                            $canvas.setLayer(layer, {
                                rotate:oldangle,
                            }).drawLayers();
                            $canvas.setLayer(layer._handles[4], {
                                x:oldhandlex,
                                y:oldhandley
                            }).drawLayers();                
                        },
                        redo:function(){
                            $canvas.setLayer(layer, {
                                rotate:newangle,
                            }).drawLayers();
                            $canvas.setLayer(layer._handles[4], {
                                x:newhandlex,
                                y:newhandley
                            }).drawLayers();               
                        }
                    });
                    layer.mousedown(layer);

                    },
                mousedown: function (layer) {
                    var previouslySelectedLayer = $canvas.selectedLayer;
                   
                    console.log("You selected " + layer.name);
                    $canvas.selectedLayer = layer;

                    //clear previous "selection"                  
                    if (previouslySelectedLayer) {
                        $canvas.enableLayerHandles(previouslySelectedLayer, false);
                    }

                    // "select" new guy
                    $canvas.enableLayerHandles(layer, true);

                    $("#nameToolbar").hide();

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

    toggleText: function (img) {
        var spanId = $(img).attr("id");
        
        var style = textEffectStyles[spanId.replace("Sample","")];
        
        return this.each(function () {
            
            var username = $canvas.data("username");
            
            if ($canvas.getLayer("usernameText") !== undefined) {
                $canvas.setLayer("usernameText", {
                    //fontFamily: $(span).css("font-family")
                    source: createTextEffect(username, style)
                });
                $canvas.drawLayers();

            


            } else {

                var img = new Image();
                img.src = createTextEffect(username, style);

                $('canvas').addLayer({
                    type: 'image',
                    //fillStyle: $(span).css("color"),
                    //fontFamily: $(span).css("font-family"),
                    //text: username,                   
                    name: "usernameText",
                    draggable:true,
                    type: 'image',
                    source: img.src,
                    x: $canvas.width() / 2,
                    y: $canvas.height() / 2,
                    width: img.width,
                    height: img.height,
                    handlePlacement: 'corners&rotational',
                    handle: {
                    type: 'arc',
                    strokeStyle: '#c33',
                    strokeWidth: 2,
                    radius: 5



                },
                    dragstart: function (layer) {
                    // code to run when dragging starts
                        layer.dragstartx = layer.x;
                        layer.dragstarty = layer.y;
                    },
                    dragstop: function (layer){
                    // code to run when dragging starts
                        var dragstopx = layer.x;
                        var dragstopy = layer.y;
                        // pointlessly copy oh wait makes it work
                        var dragstartx = layer.dragstartx;
                        var dragstarty = layer.dragstarty;

                        $canvas.undoManager.add({
                            undo:function(){
                                console.log("undoing drag start");
                                console.log("old values are ", layer.dragstartx, layer.dragstarty);
                                $canvas.setLayer(layer, {
                                    x:dragstartx,
                                    y:dragstarty
                                }).drawLayers();               
                            },
                            redo:function(){
                                console.log("restoring drag stop");
                                $canvas.setLayer(layer, {
                                    x:dragstopx,
                                    y:dragstopy
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
                        undo:function(){
                            console.log("restoring old stuff");
                            $canvas.setLayer(layer, {
                                x:oldx,
                                y:oldy,
                                width:oldwidth,
                                height:oldheight
                            }).drawLayers();              
                        },
                        redo:function(){
                            console.log("restoring new stuff");
                            $canvas.setLayer(layer, {
                                x:newx,
                                y:newy,
                                width:newwidth,
                                height:newheight
                            }).drawLayers();              
                        }
                    });
                    layer.mousedown(layer);

                    },
                    rotatehandlestart:function(layer)
                    {
                    // code to run when rotation starts
                    layer.oldangle = layer.rotate;
                    layer.oldhandlex = layer._handles[4]._endX;
                    layer.oldhandley = layer._handles[4]._endY;

                    },
                    rotatehandlestop: function(layer)
                    {
                    // code to run when rotation stops
                    var newangle = layer.rotate;
                    var newhandlex = layer._handles[4]._endX;
                    var newhandley = layer._handles[4]._endY;

                    var oldangle = layer.oldangle;
                    var oldhandlex = layer.oldhanlex;
                    var oldhandley = layer.oldhandley;
                    $canvas.undoManager.add({
                        undo:function(){
                            $canvas.setLayer(layer, {
                                rotate:oldangle,
                            }).drawLayers();
                            $canvas.setLayer(layer._handles[4], {
                                x:oldhandlex,
                                y:oldhandley
                            }).drawLayers();                
                        },
                        redo:function(){
                            $canvas.setLayer(layer, {
                                rotate:newangle,
                            }).drawLayers();
                            $canvas.setLayer(layer._handles[4], {
                                x:newhandlex,
                                y:newhandley
                            }).drawLayers();               
                        }
                    });
                    layer.mousedown(layer);

                    },

                    mousedown: function (layer) {
                        var previouslySelectedLayer = $canvas.selectedLayer;
                   
                        console.log("You selected " + layer.name);
                        $canvas.selectedLayer = layer;

                        //clear previous "selection"                  
                        if (previouslySelectedLayer) {
                            $canvas.enableLayerHandles(previouslySelectedLayer, false);
                        }

                        // "select" new guy
                        $canvas.enableLayerHandles(layer, true);


                        $("#nameToolbar").show();
                    }

                })
                    .drawLayers();

                // set layer to selected.
                layer = $canvas.getLayer("usernameText");
                layer.mousedown(layer);
                $("#nameToolbar").show();
            }






        });
    },

    addStat: function (statIcon, stat) {
        return this.each(function () {
            
            


        });
    },



    insertRect: function (x, y, width, height, fill, stroke, strokeWidth, name) {
        return this.each(function () {
            

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

    drawHollowRect: function (x, y, width, height, stroke, strokewidth, name) {
        return this.each(function () {

            $('canvas').addLayer({
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

    enableLayerHandles: function (layer, enabled) {
        if(layer)
        {
            return this.each(function (elm) {
          
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



});

$(document).ready(function () {

    $canvas = $('#workspaceCanvas');

     // undo manager
    var btnUndo,
        btnRedo;

    $canvas.undoManager = new UndoManager();    
    
    btnUndo = document.getElementById("undo");
    btnRedo = document.getElementById("redo");

    btnUndo.onclick = function () {
        console.log("UNDOING");
        $canvas.undoManager.undo();  
    };
    btnRedo.onclick = function () {
        console.log("REDOING");
        $canvas.undoManager.redo();
    };



    $("#tabs").tabs({
        hide: {
            effect: "fadeOut",
            duration: 500
        },
        show: {
            effect: "fadeIn",
            duration: 500
        },
        beforeActivate: function () {
           // toggleDoors(true);
        }
    });




    setTimeout(function() {
        //alert("Please Login to Warface To Begin Creating Your Signature.");
    toggleDoors(false);
},0);
    

    

    $("#bg-list img").click(function () {

        $canvas.insertImage(this, "background");
        var image = this;
        var layer = $canvas.selectedLayer;
        $canvas.undoManager.add({
            undo:function(){
                deleteLayer(layer);                
            },
            redo:function(){
                $canvas.addLayer(layer).drawLayers();
                $canvas.enableLayerHandles($canvas.selectedLayer, false); 
                $canvas.selectedLayer = layer;
            }
        });

    });

    $("#weapon-list img").click(function () {

        $canvas.insertImage(this);
        var image = this;
        var layer = $canvas.selectedLayer;
        $canvas.undoManager.add({
            undo:function(){
                deleteLayer(layer);                
            },
            redo:function(){
                 $canvas.addLayer(layer).drawLayers();
                 $canvas.enableLayerHandles($canvas.selectedLayer, false); 
                 $canvas.selectedLayer = layer;
            }
        });
 
    });
    $("#extras-list img").click(function () {

        $canvas.insertImage(this);
        var image = this;
        var layer = $canvas.selectedLayer;
        $canvas.undoManager.add({
            undo:function(){
                deleteLayer(layer);                
            },
            redo:function(){
                 $canvas.addLayer(layer).drawLayers();
                 $canvas.enableLayerHandles($canvas.selectedLayer, false); 
                 $canvas.selectedLayer = layer;
            }
        });

    });

    // terrible stats thing
    /*
    $("#stats-list td").click(function () {
        var $cell = $(this);
        var statIcon = $cell.find("img");
        var statName = $cell.find("span");
        console.log(statName[0].innerHTML);
        $canvas.addStat(statIcon[0], statName[0].innerHTML);

    });
    */

    registerHooksForToolbar($canvas.undoManager);

 

    var username = "SuperCoolGuy";

    $canvas.data("username", username);

    // setup text samples
 
    $("#StereoscopicSample").attr("src", createTextEffect(username, textEffectStyles[$("#StereoscopicSample").attr("id").replace("Sample","")]));
    $("#NeonSample").attr("src", createTextEffect(username, textEffectStyles[$("#NeonSample").attr("id").replace("Sample","")]));
    $("#AnaglyphicSample").attr("src", createTextEffect(username, textEffectStyles[$("#AnaglyphicSample").attr("id").replace("Sample","")]));
    $("#VintageRadioSample").attr("src", createTextEffect(username, textEffectStyles[$("#VintageRadioSample").attr("id").replace("Sample","")]));
    $("#InsetSample").attr("src", createTextEffect(username, textEffectStyles[$("#InsetSample").attr("id").replace("Sample","")]));
    $("#ShadowSample").attr("src", createTextEffect(username, textEffectStyles[$("#ShadowSample").attr("id").replace("Sample","")]));
    $("#Shadow2Sample").attr("src", createTextEffect(username, textEffectStyles[$("#Shadow2Sample").attr("id").replace("Sample","")]));
    $("#Shadow3DSample").attr("src", createTextEffect(username, textEffectStyles[$("#Shadow3DSample").attr("id").replace("Sample","")]));


                    
                     
                    
                    
                    




    $("#name-list img").click(function () {
        $canvas.toggleText(this);
        var image = this;
        var layer = $canvas.selectedLayer;
        $canvas.undoManager.add({
            undo:function(){
                deleteLayer(layer);             
            },
            redo:function(){
                $canvas.addLayer(layer).drawLayers();
                $canvas.enableLayerHandles($canvas.selectedLayer, false); 
                $canvas.selectedLayer = layer;
            }
        });
    });

 
    $("#colorPicker").spectrum({
        color: "#fff",
        className: "full-spectrum",
        showInitial: true,
        showPalette: false,
        showSelectionPalette: false,
        showAlpha: true,
        maxSelectionSize: 10,
        chooseText: "Done",
        cancelText: "",
        preferredFormat: "rgb",
        localStorageKey: "spectrum.demo",
        move: function (color) {

        },
        show: function () {

        },
        beforeShow: function () {

        },
        hide: function () {

        },
        move: function (color) {
            var layer = $canvas.selectedLayer;
            if (layer !== undefined) {

                var oldColor = layer.fillStyle;
                $canvas.setLayer(layer.name, {
                    fillStyle: color
                });
                $canvas.drawLayers();
                console.log("changed font color");
                $canvas.undoManager.add({
                    undo:function(){
                        $canvas.setLayer(layer.name, {
                            fillStyle: oldColor
                        });
                        $canvas.drawLayers();
                        console.log("changed font color");                
                  },
                    redo:function(){
                        $canvas.setLayer(layer.name, {
                            fillStyle: color
                        });
                        $canvas.drawLayers();
                        console.log("changed font color");
                    }
                });
            }
            // also change font colors of the sample displays
            /*
            $(".font1").css("color", color.toRgbString());
            $(".font2").css("color", color.toRgbString());
            $(".font3").css("color", color.toRgbString());
            */
        }
        
    });




    $("#nameToolbar").hide();
    $("#statsToolbar").hide();


    $("#shareTab").click(function() {
        // hide any layer handles & clear selection
        var layer = $canvas.selectedLayer;
        if(layer)
        {
            $canvas.selectedLayer = null;
            $canvas.enableLayerHandles(layer, false); 
        }
       
    });

   

});


function registerHooksForToolbar(undoManager){

    $("#flipVert").click(function () {
        var layer = $canvas.selectedLayer;
       flipLayerVertical(layer);
       undoManager.add({
            undo:function(){
                flipLayerVertical(layer);                
            },
            redo:function(){
                flipLayerVertical(layer);
            }
        });

    });

    $("#flipHoriz").click(function () {
        var layer = $canvas.selectedLayer;
        flipLayerHorizontal(layer);
        undoManager.add({
            undo:function(){
                flipLayerHorizontal(layer);                
            },
            redo:function(){
                flipLayerHorizontal(layer);
            }
        });

    });


    $("#upLayer").click(function () {
        var layer = $canvas.selectedLayer;
       moveLayerUp(layer);
       undoManager.add({
            undo:function(){
                moveLayerDown(layer);                
            },
            redo:function(){
                moveLayerUp(layer);
            }
        });

    });

    $("#downLayer").click(function () {
        var layer = $canvas.selectedLayer;
        moveLayerDown(layer);
        undoManager.add({
            undo:function(){
                moveLayerUp(layer);                
            },
            redo:function(){
                moveLayerDown(layer);
            }
        });
       

    });


    $("#delete").click(function () {

        var layer = $canvas.selectedLayer;
        console.log("layer before delete", layer);
        deleteLayer(layer);

        undoManager.add({
            undo:function(){
                $canvas.addLayer(layer).drawLayers();  
                $canvas.enableLayerHandles($canvas.selectedLayer, false);
                $canvas.selectedLayer = layer;
                console.log("layer after undo",layer);             
            },
            redo:function(){
                deleteLayer(layer);
                console.log("layer after redo",layer);  
            }
        });

    });
}

function rotateLayer(layer, degrees){
    if(layer)
    {
    console.log("rotating " + layer.name + " " + degrees + "  degrees");

        $canvas.animateLayer(layer.name, {
            rotate: '+=' + degrees
        }, 200);
    }

}

function flipLayerVertical(layer)
{
    if(layer)
    {

     console.log("flipping " + layer.name + " vertically");
        var value = -1;
        if (layer.scaleY === -1) {
            value = 1;
        }

        $canvas.animateLayer(layer.name, {

            scaleY: value

        }, 200);
    }
}

function flipLayerHorizontal(layer)
{
    if(layer)
    {
        console.log("flipping " + layer.name + " horizontally");

        var value = -1;
        if (layer.scaleX === -1) {
            value = 1;
        }

        $canvas.animateLayer(layer.name, {

            scaleX: value

        }, 200);
    }
}

function deleteLayer(layer)
{
    if(layer){
        $canvas.removeLayer(layer.name);
        $canvas.drawLayers();
        $canvas.selectedLayer = null;
    }
}

function moveLayerDown(layer)
{
     if(layer)
     {
        if (layer.index !== 0) {
            $canvas.moveLayer(layer.name, layer.index - 6);
            $canvas.drawLayers();
            console.log("moving " + layer.name + " down a layer");

        }
    }
}

function moveLayerUp(layer)
{
    if(layer)
    {
        var numLayers = $canvas.getLayers().length;
        if (layer.index !== (numLayers - 6)) 
        {
            $canvas.moveLayer(layer.name, (layer.index + 6));
            $canvas.drawLayers();
            console.log(layer.index);

            console.log("moving " +layer.name + " up a layer");
        }
    }

}


function toggleDoors(open) {

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


    setTimeout(function () {
        audioElement.setAttribute('src', 'audio/doorSound.mp3');
        audioElement.play();
        open = false;
        setTimeout(

        function () {

            $("#leftDoor").animate({
                left: (open ? 0 : -640)
            }, 1200);
            $("#rightDoor").animate({
                right: (open ? 0 : -640)
            }, 1200, function () {
                audioElement.pause()
            });


        }, 800);

    }, 1200);




}










function previewFile() {
    var imgElement = new Image();
    var file = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader = new FileReader();

    reader.onloadend = function () {
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

/*

  var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
             '<em>I</em> like ' + 
             '<span style="color:white; text-shadow:0 0 2px blue;">' +
             'cheese</span>' +
           '</div>' +
           '</foreignObject>' +
           '</svg>';

var DOMURL = window.URL || window.webkitURL || window;


var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
var url = DOMURL.createObjectURL(svg);


                layer.source = url;*/ 