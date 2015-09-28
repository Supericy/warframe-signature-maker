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
            var $canvas = $(this);
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
                mousedown: function (layer) {
                    var previouslySelectedLayer = $canvas.data("selectedLayer");
                    console.log(previouslySelectedLayer);

                    $canvas.data("selectedLayer", layer.name);

                    console.log("You selected " + $canvas.data("selectedLayer"));


                    //clear previous "selection"                  
                    if (previouslySelectedLayer) {
                        $canvas.enableLayerHandles(previouslySelectedLayer, false);
                        if (previouslySelectedLayer === "usernameText") {
                            $canvas.enableLayerHandles("usernameTextHandles", false);
                        }
                    }

                    // "select" new guy
                    $canvas.enableLayerHandles(layer.name, true);

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
                $canvas.enableLayerHandles(layer.name, false);

                $canvas.drawLayers();
            } else {



                $canvas.addLayer(layer);
                // select it after placing it.
                layer.mousedown(layer);
                $canvas.drawLayers();
            }









        });

    },

    removeImage: function (img) {
        var imgId = img.src;

        return this.each(function () {
            $(this)
                .removeLayer(imgId)
                .drawLayers();
        });
    },
    /* DOESN'T WORK ANYMORE SINCE LAYER NAME'S ARENT IMG.SRC / KNOWN.
    toggleImage: function (img) {
        var imgId = img.src;

        return this.each(function () {
            var $canvas = $(this);

            if ($canvas.getLayer(imgId) !== undefined) {
                $canvas.removeImage(img);
            } else {
                $canvas.insertImage(img);
                var layer = $canvas.getLayer(img.src);
                layer.click(layer);
            }
        });
    },*/



    toggleText: function (span) {
        var spanId = $(span).attr("class");

        return this.each(function () {
            var $canvas = $(this);
            var username = $canvas.data("username");
            if ($canvas.getLayer("usernameText") !== undefined) {
                $canvas.setLayer("usernameText", {
                    fontFamily: $(span).css("font-family")
                });
                $canvas.drawLayers();


            } else {
                $('canvas').addLayer({
                    type: 'text',
                    fillStyle: $(span).css("color"),
                    fontSize: 32,
                    strokeStyle: '#25a',
                    strokeWidth: 0,

                    x: 150,
                    y: 100,
                    fontFamily: $(span).css("font-family"),
                    text: username,
                    name: "usernameText",
                    mousedown: function (layer) {
                        var previouslySelectedLayer = $canvas.data("selectedLayer");
                        console.log(previouslySelectedLayer);

                        $canvas.data("selectedLayer", layer.name);

                        console.log("You selected " + $canvas.data("selectedLayer"));


                        //clear previous "selection"                  
                        if (previouslySelectedLayer) {
                            $canvas.enableLayerHandles(previouslySelectedLayer, false);
                        }

                        // "select" new guy
                        $canvas.enableLayerHandles("usernameTextHandles", true);


                        $("#nameToolbar").show();
                    }

                })
                    .drawLayers();


                var mytext = $canvas.getLayer('usernameText');
                $canvas.measureText(mytext);

                var origWidth = mytext.width;
                var origHeight = mytext.height;

                $canvas.addLayer({
                    type: 'rectangle',
                    draggable: true,
                    name: "usernameTextHandles",
                    strokeStyle: '#c33',
                    strokeWidth: 0,
                    x: mytext.x,
                    y: mytext.y,
                    width: origWidth,
                    height: origHeight,
                    handle: {
                        type: 'arc',
                        strokeStyle: '#c33',
                        strokeWidth: 2,
                        radius: 5
                    },
                    handlemove: function (layer) {
                        $canvas.setLayer(mytext, {
                            scaleX: layer.width / origWidth,
                            scaleY: layer.height / origHeight
                        });
                        $canvas.drawLayers();
                    },
                    drag: function (layer) {
                        $canvas.setLayer(mytext, {
                            x: layer.x,
                            y: layer.y
                        });
                        $canvas.drawLayers();
                    },
                    mousedown: function (layer) {
                        var layer = $canvas.getLayer("usernameText");
                        layer.mousedown(layer);
                    }
                });
                // Redraw layers to ensure handles are on top of rectangle
                $canvas.drawLayers();



                var layer = $canvas.getLayer("usernameText");
                layer.mousedown(layer);

            }






        });
    },

    addStat: function (statIcon, stat) {
        return this.each(function () {
            var $canvas = $(this);
            

            $canvas.addLayer({
                type: 'image',
                name: statIcon.src,
                source: statIcon.src,
                x: 150,
                y: 100,
                width: statIcon.width,
                height: statIcon.height,

            }).drawLayers();

            var myIcon = $canvas.getLayer(statIcon.src);

            var origIconWidth = statIcon.width;
            var origIconHeight = statIcon.height;


            $canvas.addLayer({
                type: 'text',
                fillStyle: "#000",
                fontSize: 32,
                strokeStyle: '#25a',
                strokeWidth: 0,
                x: 150,
                y: 100,
                translateX: +statIcon.width / 2,
                fontFamily: "Arial",
                text:stat,
                 name: stat

            })
                .drawLayers();

           
            var mytext = $canvas.getLayer(stat);
            $canvas.measureText(mytext);

            var origWidth = mytext.width;
            var origHeight = mytext.height;

            $canvas.setLayer(myIcon.name, {
                translateX: -myIcon.width*2 -myIcon.width/2
            });

            $canvas.setLayer(mytext.name, {
                translateX: +myIcon.width / 2
            });

            $canvas.addLayer({
                type: 'rectangle',
                draggable: true,
                name: stat + "handles",
                strokeStyle: '#c33',
                strokeWidth: 0,
                x: 150,
                y: 100,
                width: myIcon.width + mytext.width,
                height: myIcon.height,
                handle: {
                    type: 'arc',
                    strokeStyle: '#c33',
                    strokeWidth: 2,
                    radius: 5
                },
                handlemove: function (layer) {
                    $canvas.setLayer(mytext, {
                        scaleX: layer.width / (origWidth + origIconWidth),
                        scaleY: layer.height / origHeight
                    });
                    $canvas.setLayer(myIcon, {
                        scaleX: layer.width / (origWidth + origIconWidth),
                        scaleY: layer.height / origIconHeight
                    });
                    $canvas.drawLayers();
                },
                drag: function (layer) {
                    $canvas.setLayer(mytext, {
                        x: layer.x,
                        y: layer.y
                    });
                    $canvas.setLayer(myIcon, {
                        x: layer.x,
                        y: layer.y
                    });
                    $canvas.drawLayers();
                }
            });
            // Redraw layers to ensure handles are on top of rectangle

            $canvas.drawLayers();


            /*
                var layer = $canvas.getLayer(stat);
                layer.mousedown(layer);
                */








        });
    },



    insertRect: function (x, y, width, height, fill, stroke, strokeWidth, name) {
        return this.each(function () {
            var $canvas = $(this);

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

    enableLayerHandles: function (layerName, enabled) {
        return this.each(function (elm) {
            var $canvas = $(this);

            var layer = $canvas.getLayer(layerName);
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
    },

    constrainProportions: function () {
        return this.each(function (elm) {
            // if they hit shift or something maybe
            //  constrainProportions: true;
            //is all you need to apply to the selected layer.

        });
    }

});

$(document).ready(function () {

    $("#tabs").tabs({
        hide: {
            effect: "fadeOut",
            duration: 1000
        },
        show: {
            effect: "fadeIn",
            duration: 1000
        },
        beforeActivate: function () {
           // toggleDoors(true);
        }
    });




    setTimeout(function() {
        //alert("Please Login to Warface To Begin Creating Your Signature.");
    toggleDoors(false);
},0);
    

    var $canvas = $('#workspaceCanvas');

    $("#bg-list img").click(function () {

        $canvas.insertImage(this, "background");

    });

    $("#weapon-list img").click(function () {

        $canvas.insertImage(this);
 
    });
    $("#extras-list img").click(function () {

        $canvas.insertImage(this);

    });

    $("#stats-list td").click(function () {
        var $cell = $(this);
        var statIcon = $cell.find("img");
        var statName = $cell.find("span");
        console.log(statName[0].innerHTML);
        $canvas.addStat(statIcon[0], statName[0].innerHTML);

    });



    $("#rotate15").click(function () {
        console.log("rotating " + $canvas.data("selectedLayer") + " 15 degrees");

        $canvas.animateLayer($canvas.data("selectedLayer"), {
            rotate: '+=15'
        }, 200);

    });

    $("#rotate45").click(function () {
        console.log("rotating " + $canvas.data("selectedLayer") + " 45 degrees");

        $canvas.animateLayer($canvas.data("selectedLayer"), {
            rotate: '+=45'
        }, 200);

    });

    $("#flipVert").click(function () {
        console.log("flipping " + $canvas.data("selectedLayer") + " vertically");

        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        var layerName = $canvas.data("selectedLayer");
        var value = -1;
        if (layer.scaleY === -1) {
            value = 1;
        }

        $canvas.animateLayer(layerName, {

            scaleY: value

        }, 200);

    });

    $("#flipHoriz").click(function () {
        console.log("flipping " + $canvas.data("selectedLayer") + " horizontally");

        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        var layerName = $canvas.data("selectedLayer");
        var value = -1;
        if (layer.scaleX === -1) {
            value = 1;
        }

        $canvas.animateLayer(layerName, {

            scaleX: value

        }, 200);

    });


    $("#upLayer").click(function () {

        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        var numLayers = $canvas.getLayers().length;
        console.log(numLayers);
        if (layer.index !== (numLayers - 5)) {
            $canvas.moveLayer(layer.name, (layer.index + 5));
            $canvas.drawLayers();

            console.log("moving " + $canvas.data("selectedLayer") + " up a layer");
        }



    });

    $("#downLayer").click(function () {

        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        if (layer.index !== 0) {
            $canvas.moveLayer(layer.name, layer.index - 5);
            $canvas.drawLayers();
            console.log("moving " + $canvas.data("selectedLayer") + " down a layer");

        }

    });


    $("#delete").click(function () {

        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        if (layer.name === "usernameText") {
            $canvas.removeLayer("usernameTextHandles");
        }
        $canvas.removeLayer(layer.name);
        $canvas.drawLayers();
        $canvas.data("selectedLayer", null);

    });

    /*
    probably useful for figuring out what the actual drawing is and for undos.
    
    handlestart: function(layer) {
    // code to run when resizing starts
  },
  handlemove: function(layer) {
    // code to run while resizing
  },
  handlestop: function(layer) {
    // code to run while resizing stops
  }
    
    */

    var username = "SuperCoolGuy";

    $canvas.data("username", username);

    $(".font1").text(username);
    $(".font2").text(username);
    $(".font3").text(username);




    $("#name-list span").click(function () {
        $canvas.toggleText(this);
    });

    $("#incFontSize").click(function () {
        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        var factor = 0.25;


        $canvas.setLayer(layer.name, {
            scale: "+=" + factor
        });
        $canvas.drawLayers();
        console.log("increased font size");
    });

    $("#decFontSize").click(function () {
        var factor = 0.25;
        var layer = $canvas.getLayer($canvas.data("selectedLayer"));
        if (layer.scale <= 0.25) {
            factor = 0;
        }

        $canvas.setLayer(layer.name, {
            scale: "-=0" + factor
        });
        $canvas.drawLayers();
        console.log("decreased font size");
    });

    $("#colorPicker").spectrum({
        color: "#fff",
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
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
            var layer = $canvas.getLayer($canvas.data("selectedLayer"));
            if (layer !== undefined) {
                $canvas.setLayer(layer.name, {
                    fillStyle: color
                });
                $canvas.drawLayers();
                console.log("changed font color");
            }
            $(".font1").css("color", color.toRgbString());
            $(".font2").css("color", color.toRgbString());
            $(".font3").css("color", color.toRgbString());
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });




    $("#nameToolbar").hide();
    $("#statsToolbar").hide();



});








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
        audioElement.setAttribute('src', 'http://media.soundcloud.com/stream/VLWbetum1EQA.mp3');
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