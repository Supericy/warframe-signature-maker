var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};

handle["/sigs/upload"] = requestHandlers.warfaceSigUpload;
handle["/sigs/show"] = requestHandlers.warfaceSigShow;
handle["/sigs/data"]=requestHandlers.warfaceSigData;
handle["/stats/upload"] = requestHandlers.warfaceStatUpload;

server.start(router.route, handle);

