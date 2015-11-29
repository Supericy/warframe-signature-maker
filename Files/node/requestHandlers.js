
var querystring = require("querystring");
var fs = require("fs");
var url = require("url");

var jsdom = require('jsdom');
var JQuery = require( 'jquery' );
var JCanvas = require( 'jcanvas' );
var canvas = require('canvas');

function warfaceSigUpload(response,request) {
		console.log("Request handler 'warfaceSigUpload' was called.");
	
		var postData = "";
		request.setEncoding("utf8");

		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			console.log("Received POST data chunk '"+
			postDataChunk + "'.");
		});

		request.addListener("end", function() {
			//route(handle, pathname, response, postData);
			console.log("All chunks recieved");

			var queryObject = querystring.parse(request.url.replace(/^.*\?/, ''));
  		
  		
	  		if(queryObject.userId)
	  		{
	  			console.log("Signature for '" + queryObject.userId + "' updated");


				var MongoClient = require('mongodb').MongoClient;
				

				var url = 'mongodb://localhost:27017/test';
				MongoClient.connect(url, function(err,db)  {
					if(!err){
						console.log("Connected correctly to server.");
						upsertSignature(queryObject.userId,postData, db, function() {
							db.close();
						})
					} else {
						console.log(err);
					}
					
				});
			}

			// STUPID FUCKING CORS
			response.writeHead(200, {
				"Content-Type": "text/plain",
				'Access-Control-Allow-Origin' : '*'
			});


			response.write("Hey I got your request."+"\n");
			response.end();


		});



}

function warfaceSigShow(response,request) {
		console.log("Request handler 'warfaceSigShow' was called.");
	
		// STUPID FUCKING CORS
		/*
		response.writeHead(200, {
			"Content-Type": "text/plain",
			'Access-Control-Allow-Origin' : '*'
		});
		*/

		var queryObject = querystring.parse(request.url.replace(/^.*\?/, ''));
  		
  		
  		if(queryObject.userId)
  		{
  			console.log("Signature for '" + queryObject.userId + "' requested");
  			//response.write(JSON.stringify(queryObject));
  			//response.write("User data requested for: " + queryObject.userId);
  			

  			var MongoClient = require('mongodb').MongoClient;
			var dburl = 'mongodb://localhost:27017/test';

			MongoClient.connect(dburl, function(err, db) 
			{
		  		if(!err){

		  			findSignature(queryObject.userId, db, function(cursor) {

		  				var array = cursor.toArray(function (err, result) {
					     if (err) {
					        console.log(err);
					     } else if (result.length) {
					        console.log('Found signature for', queryObject.userId);
					        //console.log(result[0].signature);
					        if(result[0].signature){
					        	var signature = result[0].signature;
					        	//response.write(signature);
					        	var stats = {};
					        	var results = result[0];//stupid shit
					        	if(results.kill){
					        		stats.kill = results.kill;
					        	}
					        	if(results.kill_grenade){
					        		stats.kill_grenade = results.kill_grenade;
					        	}
					        	if(results.kill_in_slide){
					        		stats.kill_in_slide = results.kill_in_slide;
					        	}
					        	if(results.kill_headshot){
					        		stats.kill_headshot = results.kill_headshot;
					        	}
					        	if(results.kill_melee){
					        		stats.kill_melee = results.kill_melee;
					        	}
					        	if(results.kill_headshot){
					        		stats.kill_headshot = results.kill_headshot;
					        	}
					        	if(results.defibrillator_kill){
					        		stats.defibrillator_kill = results.defibrillator_kill;
					        	}
					        	if(results.two_at_once_kill){
					        		stats.two_at_once_kill = results.two_at_once_kill;
					        	}

					        	drawAndSendSignature(signature,stats,response);
	
			  					db.close();
					        }
					        
					     } else {
					     	response.writeHead(200, {
								"Content-Type": "text/plain",
								'Access-Control-Allow-Origin' : '*'
							});
					        console.log('No document(s) found with defined "find" criteria!');
					    	response.write("No signature found for: " + queryObject.userId);
					    	response.end();
					     }
					     });
		  				

		  				
		 		 	});
		  		}
			});
  			
  		}  

}



function warfaceStatUpload(response,request) {
		console.log("Request handler 'warfaceStatUpload' was called.");
	
		var postData = "";
		request.setEncoding("utf8");

		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			console.log("Received POST data chunk '"+
			postDataChunk + "'.");
		});

		request.addListener("end", function() {
			//route(handle, pathname, response, postData);
			console.log("All chunks recieved");

			var queryObject = querystring.parse(request.url.replace(/^.*\?/, ''));
  		
  		
	  		if(queryObject.userId)
	  		{
	  			var statName = postData;
	  			console.log(statName +" for '" + queryObject.userId + "' updated");

	  			
	  			

				var MongoClient = require('mongodb').MongoClient;
				

				var url = 'mongodb://localhost:27017/test';
				MongoClient.connect(url, function(err,db)  {
					if(!err){
						console.log("Connected correctly to server.");
						upsertStat(queryObject.userId,statName, db, function() {
							db.close();
						})
					} else {
						console.log(err);
					}
					
				});
			}

			// STUPID FUCKING CORS
			response.writeHead(200, {
				"Content-Type": "text/plain",
				'Access-Control-Allow-Origin' : '*'
			});


			response.write("Hey I got your request."+"\n");
			response.end();


		});



}
function warfaceSigData(response,request) {
console.log("Request handler 'warfaceSigData' was called.");
	
		// STUPID FUCKING CORS
		
		response.writeHead(200, {
			"Content-Type": "text/plain",
			'Access-Control-Allow-Origin' : '*'
		});
		

		var queryObject = querystring.parse(request.url.replace(/^.*\?/, ''));
  		
  		
  		if(queryObject.userId)
  		{
  			console.log("Signature (text) '" + queryObject.userId + "' requested");
  			//response.write(JSON.stringify(queryObject));
  			//response.write("User data requested for: " + queryObject.userId);
  			

  			var MongoClient = require('mongodb').MongoClient;
			var dburl = 'mongodb://localhost:27017/test';

			MongoClient.connect(dburl, function(err, db) 
			{
		  		if(!err){

		  			findSignature(queryObject.userId, db, function(cursor) {

		  				var array = cursor.toArray(function (err, result) {
					     if (err) {
					        console.log(err);
					     } else if (result.length) {
					        console.log('Found signature for', queryObject.userId);
					        //console.log(result[0].signature);
					        if(result[0].signature){
					        	var signature = result[0].signature;
					        	response.write(JSON.stringify(signature));
					        	response.end();	
			  					db.close();
					        }
					        
					     } else {
					     	
					        console.log('No document(s) found with defined "find" criteria!');
					    	response.write("No signature found for: " + queryObject.userId);
					    	response.end();
					     }
					     });
		  				

		  				
		 		 	});
		  		}
			});
  			
  		}  

}

var insertUser = function(db, postData, callback) {
   db.collection('users').insertOne( {
      //"username" : "SuperCoolGuy",
      "signature" : postData

   }, function(err, result) {
    if(!err){
    	console.log("Insert sucessful");
    }
    callback(result);
  });
};




var findUsers = function(db, callback) {
   var cursor = db.collection('users').find();
   callback(cursor);
 
};

var findSignature = function(userId, db, callback) {
	var cursor = db.collection('users').find({"user_id":userId});
	//console.log("Find sig cursor thing is: " + cursor);
	callback(cursor);

};

var upsertSignature = function(userId, postData, db, callback) {
   db.collection('users').update( 
   
      {"user_id": userId},
      {$set:{
      	"signature":postData
      }},
      {upsert:true}

   , function(err, result) {
    if(!err){
    	console.log("Insert sucessful");
    }
    callback(result);
  });
};

var upsertStat = function(userId, statName, db, callback) {
	var obj = {};
	obj[statName] = 1 ;
   db.collection('users').update( 
   
      {"user_id": userId},
      {$inc:
      	obj
      },
      {upsert:true}

   , function(err, result) {
    if(!err){
    	console.log("Insert sucessful");
    }
    callback(result);
  });
};





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
	      //'Content-Type': 'image/png',
	      'Access-Control-Allow-Origin' : '*',
	      //'Content-Length': img.length
	    });
	    response.end(img);

	  //response.end(sig);
	});


}


function createStatIconImage(type, value, callback) {
    var $statCanvas = $('<canvas height="116px" width="220px" />');

    $statCanvas.drawText({
        fillStyle: '#9cf',
        strokeStyle: '#25a',
        strokeWidth: 2,
        x: 150, y: 50,
        fontSize: 48,
        fontFamily: 'Verdana, sans-serif',
        text: value
    });

    $statCanvas.drawImage({
        source: type.icon,
        x: 0,
        y: 0,
        width: 70,
        height: 116,
        fromCenter: false,
        load: function () {
            callback($statCanvas.getCanvasImage('png'));
        }
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
		console.log("creating stat icon image thing for stat: ", statName, "whos value is:", stats[statName]);
		console.log("stats are: ", stats);
		//console.log("the length of ", statName.length);
		var statValue = stats[statName];
		var value = statValue ? statValue : 0;
		//console.log("value is : ", value);
		var $statCanvas = $('<canvas height="116px" width="220px" />');

		squid = fs.readFileSync('../images/statIcons/'+statName+'.png');//, function(err, squid) {
        var img = new canvas.Image();
        img.src = squid;
    	
    	var style = lay.style;
    	console.log(style);

    	var newColor = style.iconColor || {_r:152, _g:152, _b:152};

        var fontSize = 42;
       
        var numDigits = value.toString().length;
        var padding = 15 * numDigits; // function of the # digits
        var imgWidth = img.width*0.5;
        var imgHeight = img.height*0.5;
       
        // to do get this stuff from a temp canvas as its not going to work after all
        var textWidth = fontSize/3 * numDigits; // guestimate since other methods require using canvas width/height which server can't do
        
        //imgWidth = lay.width - textWidth - padding;
        //imgHeight = lay.height;

        //console.log("textwidth: for ", value + " is " , textWidth);
        $statCanvas[0].width = textWidth + imgWidth + padding;//todo make these relative
        $statCanvas[0].height = imgHeight;

        //canvas.width = textWidth + imgWidth + padding;//todo make these relative
        //canvas.height = imgHeight;

        if(style.fillStyle)
        {
            style.fillStyle = tinyToRGBString(style.fillStyle);
        }
        if(style.strokeStyle)
        {
            style.strokeStyle = tinyToRGBString(style.strokeStyle);
        }
        //console.log(style.strokeStyle);
        $statCanvas.drawText({
            fillStyle: style.fillStyle || 'orange',
            strokeStyle:style.strokeStyle || 'black',
            strokeWidth: style.strokeWidth || 2,
            x: imgWidth+padding, y: $statCanvas[0].height/2, 
            fontSize: fontSize,
            fontFamily: style.font.family || 'Impact',
            text: value
        });

		img.src = changeStatIconColor(img, style.iconColor, $);
		
        $statCanvas.drawImage({
            source: img,
            x: 0,
            y: 0,
            //width: imgWidth,
            //height: imgHeight,
            width:300,
            height:100,
            fromCenter: false,
        });



		squid = $statCanvas.getCanvasImage( 'png' );
        img.src = squid;
     




        // fuck you js dom
        lay.width = 600;
        lay.height = 200;
        // THIS MAKES NO SENSE WHY DOESN'T IT DRAW IT IN THE RIGHT SPOT
        //console.log(lay.x + "," + lay.y);

        lay.x = lay.x + 230;
        lay.y = lay.y + 75;
        /*
        lay.x = lay.x + lay.width; // somehow this works
        lay.y = lay.y + lay.height;  // somehow this works
        
        lay.width = lay.width * 3;
        lay.height = lay.height * 3;
        */
      
       

	} else {
	squid = fs.readFileSync(lay.source.replace(/^.*?(?=Files\/)/i, '../../'));//, function(err, squid) {
        var img = new canvas.Image();
        img.src = squid;
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
            rotate:lay.rotate
         });
 
	//});
	
}



function changeStatIconColor(img, color,$){
  // assumes the icon is already loaded

  var $statCanvas2 = $('<canvas id="2" height="100px" width="220px" />');
  $statCanvas2[0].width = img.width*0.5;
  $statCanvas2[0].height = img.height*0.5;

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

exports.warfaceSigUpload = warfaceSigUpload;
exports.warfaceSigShow = warfaceSigShow;
exports.warfaceStatUpload = warfaceStatUpload;
exports.warfaceSigData = warfaceSigData;