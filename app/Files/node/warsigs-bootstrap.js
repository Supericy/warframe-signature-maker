var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var liveEvents = require("./live-events");

var handle = {};

handle["/sigs/upload"] = requestHandlers.warfaceSigUpload;
handle["/sigs/show"] = requestHandlers.warfaceSigShow;
handle["/sigs/data"] = requestHandlers.warfaceSigData;
handle["/stats/upload"] = requestHandlers.warfaceStatUpload;
handle["/live"] = requestHandlers.warfaceLiveEvents;
handle["/"] = requestHandlers.warfaceHomepage;

liveEvents.start();
server.start(router.route, handle);
