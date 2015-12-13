
function route(handle, pathname, response, request) {
	console.log("Routing request for " + pathname);

	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		/*
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
		*/
		warfaceElse(response, pathname);
	}
}
var fs = require("fs");

function warfaceElse(response, pathname) {
	console.log("homepage");
	fs.readFile(__dirname + "/app/"+pathname, function (err, html) {
	    if (err) {
	       // throw err;
	       response.writeHead(404, {"Content-Type": "text/plain"});
		   response.write("404 Not Found");
		   response.end();
	    } else {
			response.writeHeader(200, {"Content-Type": pathname.indexOf('.css')>0? "text/css" :"text/plain"});
			response.write(html);
			response.end();
		}
	});
}

exports.route = route;