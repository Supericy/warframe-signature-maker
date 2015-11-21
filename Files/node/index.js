var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");


var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/warface/sigs/upload"] = requestHandlers.warfaceSigUpload;
handle["/warface/sigs/show"] = requestHandlers.warfaceSigShow;
handle["/warface/stats/upload"] = requestHandlers.warfaceStatUpload;
server.start(router.route, handle);

