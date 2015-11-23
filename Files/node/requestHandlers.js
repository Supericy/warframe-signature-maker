
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var url = require("url");

var jsdom = require('jsdom');
var JQuery = require( 'jquery' );
var JCanvas = require( 'jcanvas' );

function start(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		
		/*'<form action="/upload"  method="post">'+
		'<textarea name="text" rows="20" cols="60"></textarea>'+
		'<input type="submit" value="Submit text" />'+
		'</form>'+
		*/

		'<form action="/upload" enctype="multipart/form-data" method="post">'+
		'<input type="file" name="upload">'+
		'<input type="submit" value="Upload File" />'+
		'</form>'+
		'</body>'+
		'</html>';

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();

}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		/* Possible error on Windows systems:
		tried to rename to an already existing file */
		if(files.upload)
		{
			fs.rename(files.upload.path, "./tmp/test.png", function(err) 
			{
				if (err) 
				{
					fs.unlink("./tmp/test.png");
					fs.rename(files.upload.path, "./tmp/test.png");
				}
			});
		}
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function(error, file) 
	{
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}


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

					        	drawAndSendSignature(signature,response);

			  					
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




canvas = require('canvas');

var drawAndSendSignature = function(signature, response) {

	var html = '<html><body><canvas id="cx" width="600" height="300"></canvas></body></html>';

	jsdom.env( html, function ( errors, window ) {
	  if( errors ) console.log( errors );

	  var $ = JQuery( window );   
	  JCanvas( $, window );  


	  var $c  = $( '<canvas>' );

	  // hack required by width/height bug in jsdom/node-canvas integration
	  $c[0].width = 600;
	  $c[0].height = 300;
	  //console.log("canvas height: " + $c[0].height);
	 
	  var unserializedCanvas = unserializeCanvas(JSON.parse(signature));
	  //console.log("unserialized canvas : " + unserializedCanvas);
	  for (var i = 0; i < unserializedCanvas.length; i++) {
	  	var layer = unserializedCanvas[i];
	  	if(layer.type === 'image')
	  	{
	  		console.log("this layer has an image: " + layer + "drawing manually");
	  		drawLayerManually($c, layer);// BUT THIS IS ASYNC?


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


function drawLayerManually($c, lay) {
	console.log(lay.name.length);
	if(lay.name === "usernameText"){
		//var img = new Buffer(lay.source.replace("data:image/png;base64,",""), 'base64');
		var img = new canvas.Image();
		img.src = lay.source;
	} else if (lay.name.length < 20) {
		var img = new canvas.Image();
		img.src = lay.source;
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


exports.start = start;
exports.upload = upload;
exports.show = show;

exports.warfaceSigUpload = warfaceSigUpload;
exports.warfaceSigShow = warfaceSigShow;
exports.warfaceStatUpload = warfaceStatUpload;