
// generic overwolf stuff
function dragMove() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.dragMove(result.window.id);
    }
  });
};

function closeWindow() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.close(result.window.id);
    }
  });
};

function openSubWindow() {
  //alert("the subwindow will only be visible inside a game");
  overwolf.windows.obtainDeclaredWindow("SubWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        console.log(result);
      });
    }
  });
};

function takeScreenshot() {
  overwolf.media.takeScreenshot(function(result) {
    if (result.status == "success") {
      var img = document.getElementById("screenshot");
      img.src = result.url;
      img.onload = function() {
        overwolf.media.shareImage(img, "Screen Shot");
      };
    }
  });
}


function checkIfWarfaceRunning(){
	overwolf.games.getRunningGameInfo(function(GameInfo){
		if(GameInfo){
    		if(GameInfo.id === 77843) // warface
    		{
    			if(GameInfo.isRunning)
    			{
    				console.log("Warface is running!");
    				localStorage.setItem("warfaceRunning", true);
    			} else {
    				console.log("Warface has STOPPED!");
    				localStorage.setItem("warfaceRunning", false);
    			}
    		}
    	}
	})
}


$( document ).ready(function() {
// warface game info events
overwolf.games.onGameInfoUpdated.addListener(
    function (GameInfoChangeData) {
    	var gInfo = GameInfoChangeData.gameInfo
    	console.log(GameInfoChangeData);
    	if(gInfo){
    		if(gInfo.id === 77843) // warface
    		{
    			console.log("New warface game info event fired!");
    			if(gInfo.isRunning)
    			{
    				console.log("Warface is running!");
    				localStorage.setItem("warfaceRunning", true);
    				// launch main window?
    			} else {
    				console.log("Warface has STOPPED!");
    				// close ourselves likely.
    				localStorage.setItem("warfaceRunning", false);
    			}
    		}
    	}
        
    }
);

// warface actual game events
overwolf.games.events.onNewEvents.addListener(
    function (JSONObject) {
    	if(JSONObject.events)
    	{
    		var eventArray = JSONObject.events;
	    	for(var i=0; i<eventArray.length;i++)
	    	{
	    		var event = eventArray[i];
	    		console.log("Event:", event.name);
	    	}
    	}
        
    }
);	

// warface actual game info?
overwolf.games.events.onInfoUpdates.addListener(
    function (JSONObject) {
    	if(JSONObject.info)
    	{
    		//console.log("Info array: ", JSONObject.info);
    		var infoArray = JSONObject.info;
    		for(var i=0; i<infoArray.length; i++)
	    	{
	    		//console.log("Info:", infoArray[i]);
	    		var info = infoArray[i];
	    		if(info.category === "player" && info.key === "username")
	    		{
	    			localStorage.setItem("username", info.value);
	    			console.log("The user is:", info.value);
	    		}
	    	}
    	}
    	        
    }
);	


checkIfWarfaceRunning();

});
