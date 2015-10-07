
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");


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
			var MongoClient = require('mongodb').MongoClient;
			

			var url = 'mongodb://localhost:27017/test';
			MongoClient.connect(url, function(err,db)  {
				if(!err){
					console.log("Connected correctly to server.");
					insertUser(db, postData, function() {
						db.close();
					})
				} else {
					console.log(err);
				}
				
			});




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
		response.writeHead(200, {
			"Content-Type": "text/plain",
			'Access-Control-Allow-Origin' : '*'
		});

		

		var MongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost:27017/test';

		MongoClient.connect(url, function(err, db) 
		{
	  		if(!err){

	  			findUsers(db, function(cursor) {

	  				var array = cursor.toArray(function (err, result) {
				     if (err) {
				        console.log(err);
				     } else if (result.length) {
				        console.log('Found:', result);
				        response.write(JSON.stringify(result));
		  				response.end();
		  				db.close();
				     } else {
				        console.log('No document(s) found with defined "find" criteria!');
				     }
				     });

	  				
	 		 	});
	  		}
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




exports.start = start;
exports.upload = upload;
exports.show = show;

exports.warfaceSigUpload = warfaceSigUpload;
exports.warfaceSigShow = warfaceSigShow;