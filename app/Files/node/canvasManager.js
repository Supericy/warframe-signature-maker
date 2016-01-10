var jsdom = require('jsdom');
var JQuery = require( 'jquery' );
var JCanvas = require( 'jcanvas' );
var canvas = require('canvas');
var fs = require("fs");
var glob = require("glob");


var imageCache = {};
var preloadImages = function(callback){
	var statNames =  ["kill","kill_in_slide","kill_headshot","kill_melee","kill_grenade","kill_headshot","defibrillator_kill","two_at_once_kill"];
	var statIconFolder = ["statIcons"];
	var imageFolders = ["backgrounds", "extras", "weapons"];
	var imageCache = {};
	// preload all stat icons
	for (var i = 0; i < statNames.length; i++) {
		var imgPath = 'images/' + statIconFolder + '/' + statNames[i] + '.png';
		var squid = fs.readFileSync(imgPath);
		//var img = new canvas.Image();
		//img.src = squid;
		imageCache[imgPath] = squid;
	}
	// preload everything else
	for (var i = 0; i < imageFolders.length; i++) {
		var fileNames = fs.readdirSync('images/' + imageFolders[i])
		console.log(fileNames);
		for(var j = 0; j < fileNames.length; j++) {
			var imgPath = 'images/' + imageFolders[i] + '/' + fileNames[j];
			var squid = fs.readFileSync(imgPath);
			//var img = new canvas.Image();
			//img.src = squid;
			imageCache[imgPath] = squid;
			console.log(imgPath);
		}

	}
	//console.log("image cache: " + JSON.stringify(imageCache));
	callback();
}


var drawAndSendSignature = function(signature, stats, response) {

	var html = '<html><body><canvas id="cx" width="600" height="200"></canvas></body></html>';

	jsdom.env( html, function ( errors, window ) {
	  if( errors ) console.log( errors );

	  var $ = JQuery( window );
	  JCanvas( $, window );


	  var $c  = $( '<canvas>' );

	  // hack required by width/height bug in jsdom/node-canvas integration
	  $c[0].width = 600;
	  $c[0].height = 200;


	  //console.log("canvas height: " + $c[0].height);

	  var unserializedCanvas = unserializeCanvas(JSON.parse(signature));
	  //console.log("unserialized canvas : " + unserializedCanvas);
	  for (var i = 0; i < unserializedCanvas.length; i++) {
	  	var layer = unserializedCanvas[i];
	  	if(layer.type === 'image')
	  	{
	  		console.log("this layer has an image: " + layer.name + "drawing manually");
	  		drawLayerManually($c, layer, stats, $);// BUT THIS IS ASYNC?


	  	} else {
        	$c.addLayer(layer);
        	//console.log($c.getLayer(0));
    	}
      }
      //$c.drawLayers();



	  // convert canvas and send
	  console.log("to data url being called now");
	  var sig = $c.getCanvasImage( 'png' );
	  //console.log(sig);


	  // attempt to send an actual image instead of base 64 stuff
	  var img = new Buffer(sig.replace("data:image/png;base64,",""), 'base64');
	    response.writeHead(200, {
	      'Content-Type': 'image/png',
	      'Access-Control-Allow-Origin' : '*',
	      //'Content-Length': img.length
	    });
	    response.end(img);

	  //response.end(sig);
	});


}


function drawLayerManually($c, lay, stats, $) {
	var statsRecording = ["kill","kill_in_slide","kill_headshot","kill_melee","kill_grenade","kill_headshot","defibrillator_kill","two_at_once_kill"];

	if(lay.name === "usernameText"){
		//var img = new Buffer(lay.source.replace("data:image/png;base64,",""), 'base64');
		var img = new canvas.Image();
		img.src = lay.source;
	} else if (statsRecording.indexOf(lay.name)>=0) {
		var statName = lay.name;
		//console.log("creating stat icon image thing for stat: ", statName, "whos value is:", stats[statName]);
		//console.log("stats are: ", stats);
		//console.log("the length of ", statName.length);
		var statValue = stats[statName];
		var value = statValue ? statValue : 0;
		//console.log("value is : ", value);
		//var $statCanvas = $('<canvas height=' + lay.height + 'px width=' + lay.width + '220px" />');

		//squid = fs.readFileSync('images/statIcons/'+statName+'.png');//, function(err, squid) {
        //var img = new canvas.Image();
        //img.src = squid;

		var img = new canvas.Image();
		squid = imageCache['images/statIcons/'+statName];

		if(squid){
			img.src = squid;
		} else {
			img.src =  fs.readFileSync('images/statIcons/'+statName+'.png');
		}

    	var style = lay.style;
    	//console.log(style);
    	console.log("fill  color from style is :")
    	console.log(style.fillStyle);
    	var newColor = style.iconColor || {_r:152, _g:152, _b:152};



    	var oriWidth = lay.width;
    	var oriHeight = lay.height;

        var numDigits = value.toString().length;
        //var padding = 15 * numDigits; // function of the # digits

        var imgWidth = lay.height * (img.width/img.height);//img.width*0.5;
        var imgHeight = lay.height;//img.height*0.5;


        var fontSize = imgHeight - 7;//42;

        var textWidth = fontSize/2 * numDigits; // guestimate since other methods require using canvas width/height which server can't do

      	var vTextOffset = fontSize/7;

      	var spaceWidth = Math.min(imgWidth, imgHeight);

      	var padding = spaceWidth/2;//(  (spaceWidth/4) * numDigits) + spaceWidth/2;

      	if(imgWidth > imgHeight)
      	{
      		padding = padding*1.5;
      	}
      	//console.log("num digits:", numDigits);
      	//console.log("Layer x: ", lay.x);
      	//console.log("Img width, height", imgWidth, imgHeight);
      	//console.log("text width, padding", textWidth, padding);
        // FIXING THINGS
        lay.height =  imgHeight;
        lay.width = textWidth + imgWidth + padding;
        //console.log("final width ,height", lay.width, lay.height);
        var $statCanvas = $('<canvas height=' + lay.height + 'px width=' + lay.width + 'px" />');
        $statCanvas[0].width = textWidth + imgWidth + padding;//todo make these relative
        $statCanvas[0].height = imgHeight;

     	if(numDigits > 2){
     		//lay.x = lay.x + lay.width -oldwidth;
     	}
     	//lay.x = lay.x +


        if(style.fillStyle)
        {
            style.fillStyle = tinyToRGBString(style.fillStyle);
        }
        if(style.strokeStyle)
        {
            style.strokeStyle = tinyToRGBString(style.strokeStyle);
        }


        // for testing purposes
/*
        $statCanvas.drawRect({
		  fillStyle: '#000',
		  x: 0, y: 0,
		  width: lay.width,
		  height: lay.height,
		  opacity:0.5,
		  fromCenter:false
		});
*/

	/*
impact, georgia, palatino blah blah, arial black blah blah, lucida console, courier new blah blah
	*/

		var _canvas = $statCanvas[0];
		var _ctx = _canvas.getContext('2d');

		var fontFiles = glob.sync("node/fonts/*.ttf", {});
		fontFiles.forEach(function (file) {
			var matches = file.match(/[^\/]+(?=.ttf)/);
			var fontName = matches[0];
			console.log(fontName, file);
			var _font = new canvas.Font(fontName, file);
			_ctx.addFont(_font);
		});


        //console.log(style.strokeStyle);
        $statCanvas.drawText({
            fillStyle: style.fillStyle || 'orange',
            strokeStyle:style.strokeStyle || 'black',
            strokeWidth: style.strokeWidth || 2,
            x: (imgWidth/2)+padding, y: (lay.height/2-vTextOffset*3)/2,
            fontSize: fontSize,
            fontFamily: 'Impact',
            text: value,
		    fromCenter:false
        });

		img.src = changeStatIconColor(img, newColor, $);

        $statCanvas.drawImage({
            source: img,
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
		    fromCenter:false
        });






		squid = $statCanvas.getCanvasImage( 'png' );
        img.src = squid;


        lay.y = lay.y - oriHeight/2;
        lay.x = lay.x - oriWidth/2;




	} else {
		//squid = fs.readFileSync(lay.source.replace(/^.*?Files\//i, ''));
        //var img = new canvas.Image();
        //img.src = squid;
		var img = new canvas.Image();
		squid = imageCache[lay.source.replace(/^.*?Files\//i, '')];
		console.log("Looking for : " + lay.source.replace(/^.*?Files\//i, ''));
		console.log("Image from cache is: " + squid);
		console.log("Full cache is : " + JSON.stringify(imageCache));
		if(squid){
			img.src = squid;
		} else {
			img.src = fs.readFileSync(lay.source.replace(/^.*?Files\//i, ''));
		}
    }
        $c.drawImage({
        	name:lay.name,
            source: img,
            x: lay.x,
            y: lay.y,
            width: lay.width,
            height: lay.height,
            draggable:lay.draggable,
            opacity:lay.opacity,
            translateX:lay.translateX,
            translateY:lay.translateY,
            scaleY:lay.scaleY,
            scaleX:lay.scaleX,
            rotate:lay.rotate,
            fromCenter:!(statsRecording.indexOf(lay.name)>=0)
         });

	//});

}



function changeStatIconColor(img, color,$){
  // assumes the icon is already loaded

  var $statCanvas2 = $('<canvas height=' + img.height + 'px width=' + img.width + 'px" />');
  $statCanvas2[0].width = img.width;
  $statCanvas2[0].height = img.height;

  var canvas2 = $statCanvas2[0];
  var ctx = canvas2.getContext("2d");
  var originalPixels = null;
  var currentPixels = null;

  ctx.drawImage(img, 0, 0, img.width, img.height);// 0, 0, img.width, img.height);
  originalPixels = ctx.getImageData(0, 0, img.width, img.height);
  currentPixels = ctx.getImageData(0, 0, img.width, img.height);

  var newColor = tinyToRGB(color);

  for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
  {
      if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
      {

          currentPixels.data[I] = /*originalPixels.data[I] / 255 **/ newColor.R;
          currentPixels.data[I + 1] = /*originalPixels.data[I + 1] / 255 **/ newColor.G;
          currentPixels.data[I + 2] = /*originalPixels.data[I + 2] /255 **/  newColor.B;
      }
  }

  ctx.putImageData(currentPixels, 0, 0);
  //console.log(canvas.toDataURL("image/png"));
  return $statCanvas2.getCanvasImage( 'png' );
}

function tinyToRGB(tiny)
{
  //var long = parseInt(hex.replace(/^#/, ""), 16);
  var test = tiny;//.toRgb(); god damn node

  return {
      R: test._r,//(long >>> 16) & 0xff,
      G: test._g,//(long >>> 8) & 0xff,
      B: test._b,//long & 0xff
  };
}

function tinyToRGBString(tiny)
{
	return tiny;
  //var long = parseInt(hex.replace(/^#/, ""), 16);
  console.log(tiny);
  var test = tiny;//.toRgb(); god damn node
  if(test){
  return "rgb(" + test._r + "," + test._g + "," + test.b + ")";}
  else return null;

}

function unserializeLayer(sLayer) {
  //console.log("unserializing: ", sLayer);
  var layer = {
    type: sLayer.type,
    draggable: sLayer.draggable,
    x: sLayer.x,
    y: sLayer.y,
    width: sLayer.width,
    height: sLayer.height,
    opacity: sLayer.opacity,
    translateX: sLayer.translateX,
    translateY: sLayer.translateY,
    scaleY: sLayer.scaleY,
    scaleX: sLayer.scaleX,
    rotate: sLayer.rotate
	};
	if(sLayer.name){
		layer.name = sLayer.name;
	}
	if(sLayer.source){
		layer.source = sLayer.source;
	}
	if(sLayer.style){
    layer.style = sLayer.style;
  }
	//console.log("unserailized layer : ", layer);
  return layer;
}

function unserializeCanvas(serializedCanvas) {

  var unserialized = [];
  //console.log("Serialized canvas[0]", serializedCanvas[0]);
  for (var n = 0; n < serializedCanvas.length; n++) {
    unserialized.push(unserializeLayer(serializedCanvas[n]));
  }
  return unserialized;
}


exports.drawAndSendSignature = drawAndSendSignature;
exports.preloadImages = preloadImages;
exports.imageCache = imageCache;
