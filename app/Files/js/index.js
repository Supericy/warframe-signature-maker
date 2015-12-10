
// generic overwolf stuff
function dragMove() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.dragMove(result.window.id);
    }
  });
};


function openSigMakerWindow() {
  //alert("the subwindow will only be visible inside a game");
    console.log("opening sig maker window");
  overwolf.windows.obtainDeclaredWindow("SigMakerWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        //console.log(result);
      });
    }
  });
};


function checkIfWarfaceRunning(callback){
  callback = callback || function(a){};
  console.log('checking if warface is running');
  overwolf.games.getRunningGameInfo(function(GameInfo){
    console.log("call back being run with gameinfo:");
    console.log(GameInfo);
    if(GameInfo){
        if(GameInfo.id === 77843) // warface
        {
          if(GameInfo.isRunning)
          {
            console.log("Warface is running!");
            localStorage.setItem("warfaceRunning", true);
            callback(true);
          } else {
            console.log("Warface is NOT running!");
            localStorage.removeItem("warfaceRunning");
            //localStorage.removeItem("username");
            callback(false);
          }
        }
      }
      else {
        console.log("Warface is NOT running!");
        localStorage.removeItem("warfaceRunning");
        //localStorage.removeItem("username");
        callback(false);
      }
  });
}


$( document ).ready(function() {

  var statsRecording = ["kill","kill_in_slide","kill_headshot","kill_melee","kill_grenade","kill_headshot","defibrillator_kill","two_at_once_kill"];


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
              localStorage.removeItem("warfaceRunning");
              closeIndexWindow();
              //localStorage.removeItem("username");
            }
          }
        }
          
      }
  );

  // warface actual game events
  overwolf.games.events.onNewEvents.addListener(

      function (JSONObject) {
         console.log("New warface event!");
        if(JSONObject.events)
        {
          var eventArray = JSONObject.events;
          for(var i=0; i<eventArray.length;i++)
          {
            var event = eventArray[i];
            console.log(event);
            console.log("Event:", event.name);
            console.log($.inArray(event.name, statsRecording));
            if($.inArray(event.name, statsRecording)>=0){
              $.ajax({
                type: "POST",
                //url: "http://107.170.105.215:8888/warface/sigs/upload?userId=" + "bill", /* THIS NEEDS TO BE THE USER ID */
                url: "http://warfacesigs.me/stats/upload?userId=" + localStorage.getItem("username"),
                data: event.name,
                crossDomain:true,
                success: function(data) {
                  console.log(data);
                  if (data) {
                    return console.log("SUCCESS Connection, stat sent to server");
                  } else {
                    return console.log("Data isn't available");
                  }
                },
                error: function(data) {
                  return console.log("ERROR Connection");
                }
              });
            }
          }
        }
          
      }
  );  


  // warface actual game info?
  overwolf.games.events.onInfoUpdates.addListener(
      function (JSONObject) {
        console.log("username event fired", JSONObject);
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


  


  localStorage.removeItem("warfaceRunning");
  //localStorage.removeItem("username");
  $('#indexWindow').show();
  checkIfWarfaceRunning();
  
  overwolf.windows.onMainWindowRestored.addListener(function(){
    console.log('restoring index window');

    // check if sig maker open first 
    overwolf.windows.getWindowState("SigMakerWindow", function(state){
      console.log("sig maker is in the state :" +  state.window_state);
    
    if(state.window_state !== 'closed') {
      
      minimizeIndexWindow(); 
    } else {
      $('#indexWindow').show();
      checkIfWarfaceRunning();
      localStorage.removeItem("warfaceRunning");
      //localStorage.removeItem("username");
    }

    });
  });
});



function indexNoPressed(){
  console.log("no pressed");
  //closeIndexWindow();
  $('#indexWindow').hide();
  minimizeIndexWindow(); 
}

function indexYesPressed(){
  openSigMakerWindow();
  console.log("yes pressed");
  //closeIndexWindow();
  $('#indexWindow').hide();
  minimizeIndexWindow(); 
}

function minimizeIndexWindow() {
  //alert("the subwindow will only be visible inside a game");
    console.log("minimizing index window");
  overwolf.windows.obtainDeclaredWindow("IndexWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.minimize(result.window.id, function(result) {
        //console.log(result);
      });
    }
  });
};

function closeIndexWindow() {
   overwolf.windows.obtainDeclaredWindow("IndexWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.close(result.window.id, function(result) {
        //console.log(result);
      });
    }
  });
};