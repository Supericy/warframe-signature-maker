
// generic overwolf stuff
function dragMove() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.dragMove(result.window.id);
    }
  });
};

function closeCurrentWindow() {
  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status == "success") {
      overwolf.windows.close(result.window.id);
    }
  });
};

function openProbeWindow() {
  //alert("the subwindow will only be visible inside a game");
  console.log("opening probe window");
  overwolf.windows.obtainDeclaredWindow("ProbeWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        console.log(result);
      });
    }
  });
};

function openSigMakerWindow() {
  //alert("the subwindow will only be visible inside a game");
    console.log("opening sig maker window");
  overwolf.windows.obtainDeclaredWindow("SigMakerWindow", function(result) {
    if (result.status == "success") {
      overwolf.windows.restore(result.window.id, function(result) {
        console.log(result);
      });
    }
  });
};


$( document ).ready(function() {

});

function indexNoPressed(){
  closeCurrentWindow();
  openProbeWindow();
    console.log("no pressed");
}

function indexYesPressed(){
  openSigMakerWindow();
   console.log("yes pressed");

}