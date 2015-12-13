
var querystring = require("querystring");
var fs = require("fs");
var url = require("url");

var canvasManager = require('./canvasManager');
var dbManager = require('./databaseManager');
var liveEvents = require('./live-events');


function warfaceHomepage(response, request) {
	console.log("homepage");
	fs.readFile(__dirname + "/app/index.html", function (err, html) {
	    if (err) {
	       // throw err;
	       response.writeHead(404, {"Content-Type": "text/plain"});
		   response.write("404 Not Found");
		   response.end();
	    } else {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.write(html);
			response.end();
		}
	});
}


function warfaceLiveEvents(response, request) {
	fs.readFile(__dirname + "/app/live.html", function (err, html) {
	    if (err) {
	        //throw err;
	        response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found");
			response.end();
	    } else {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.write(html);
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
	});

	request.addListener("end", function() {
		console.log("All chunks recieved");
		var queryObject = querystring.parse(request.url.replace(/^.*\?/, ''));
  		if(queryObject.userId)
  		{
  			console.log("Signature for '" + queryObject.userId + "' uploaded");

  			dbManager.updateSignature(queryObject.userId, postData, function(err){
  				if(!err){
  					console.log("Signature successfully updated.")
  				} else {
  					console.log("Error updating signature");
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
	var userId = request.url.replace(/^.*\//, '').replace('.png', '');

	console.log(userId);
	if(userId) {
		console.log("Signature for '" + userId + "' requested");

		dbManager.findSignatureAndStats(userId, function(err, signature, stats){
			if(!err){
				canvasManager.drawAndSendSignature(signature,stats,response);
			} else {
				console.log("Error finding signature");
				noSignatureFound(response);
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
  			console.log(statName +" for '" + queryObject.userId + "' uploaded");

  			dbManager.updateStats(queryObject.userId, statName, function(err){
  				if(!err){
  					console.log("Successfully updated stat");
  				} else {
  					console.log("Error updating stat");
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
		console.log("Signature (data) '" + queryObject.userId + "' requested");
		dbManager.findSignatureAndStats(queryObject.userId, function(err, signature, stats){
			if(!err){
				if(signature){
					response.write(signature); // no more double json stringify!
	        		response.end();
				} else {
					console.log('No document(s) found with defined "find" criteria!');
			    	response.write("No signature found for: " + queryObject.userId);
			    	response.end();
				}
	        	
			} else {
				console.log("Error finding signature");
				response.write("No signature found for: " + queryObject.userId);
			    response.end();
			}
		});
	}
}

function noSignatureFound(response){
    response.writeHead(200, {
	      'Content-Type': 'image/png',
	      'Access-Control-Allow-Origin' : '*',
	    });

    fs.readFile('images/ui/nosig.png', function(err, squid) {
		response.write(squid, 'binary');
		response.end();
	});
}

exports.warfaceSigUpload = warfaceSigUpload;
exports.warfaceSigShow = warfaceSigShow;
exports.warfaceStatUpload = warfaceStatUpload;
exports.warfaceSigData = warfaceSigData;
exports.warfaceLiveEvents = warfaceLiveEvents;
exports.warfaceHomepage = warfaceHomepage;
