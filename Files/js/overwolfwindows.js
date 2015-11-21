
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
