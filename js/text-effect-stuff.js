function initColorPickers(selector) {
  $(selector).spectrum({
    color: "#fff",
    containerClassName: "test",
    className: "test",
    showInitial: true,
    showPalette: false,
    showSelectionPalette: false,
    showAlpha: true,
    maxSelectionSize: 10,
    chooseText: "Done",
    cancelText: "",
    preferredFormat: "rgba",
    localStorageKey: "spectrum.demo",

    move: function(color) {
      var usernameLayer = $canvas.getLayer("usernameText");
      var shadows = [];
      $('#shadows .shadow').each(function() {
        var position = $(this).find('.text-style-shadow').val();
        var color = $(this).find('.text-style-shadow-color').val();
        var shadowID = $(this).attr("id");
        shadows.push(position + ' ' + color + '~' + shadowID);
      });

      var style = {
        color: color,
        shadow: shadows
      };
      currentTextStyle = style;

      usernameLayer.source = createTextEffect($canvas.data("username"), style);
      $canvas.drawLayers();
    }
  });
}

$(function() {
  var $canvas = $('#workspaceCanvas');

  initColorPickers('.color-picker');

  $("#addShadowButton").click(function() {
    console.log("HEYA");
    currentTextStyle.shadow.push("0px 0px 5px #fffff");
    doStuff();
  });



});


function doStuff() {

  var shadows = currentTextStyle.shadow;
  // TODO: refactor... so ugly
  var $shadowBase = $(
    '<div class="shadow" id="">' +
    '<input class="text-style-shadow" type="text">' +
    '<input class="text-style-shadow-color color-picker" type="text">' +
    '<button type="button" class="removeShadowButton">Remove</button>' +
    '</div>');

  $('#shadows').empty();

  $('#customize-text-color').spectrum("set", currentTextStyle.color);

  $('#customize-text-font').val("I'M A FONT");

  var shadowID = new Date().getTime();
  for (var n = 0, length = shadows.length; n < length; n++) {
    // just turning "0 0 10px red" into ['0', '0', '10px', 'red']
    var chunks = shadows[n].split(' ');
    var shadowColor = chunks.pop();
    var shadowPosition = chunks.join(' ');

    var $shadow = $shadowBase.clone();

    $('#shadows').append($shadow);

    $shadow.find('.text-style-shadow').val(shadowPosition);
    $shadow.find('.text-style-shadow-color').data("color", shadowColor);
    $shadow.attr("id", shadowID);
  }

  // TODO: yuck... can probably use shadowID to filter this now?
  $('#shadows .shadow .text-style-shadow-color').each(function() {
    initColorPickers(this);
    $(this).spectrum("set", $(this).data("color"));
  });


  var usernameLayer = $canvas.getLayer("usernameText");
  usernameLayer.source = createTextEffect($canvas.data("username"), currentTextStyle);
  $canvas.drawLayers();



  $(".removeShadowButton").click(function() {
    var shadows = currentTextStyle.shadow;
    console.log(shadows);
    var shadowID = $(this).parent("div").attr("id");
    console.log("its id is:", shadowID);

    var $shadows = $('#shadows');
    var list = $shadows.children();
    console.log(list);

    for (var n = 0, length = shadows.length; n < length; n++) {

      console.log(list[n]);
      if (shadowID === list[n].id) {

        console.log("FouND IT: ", shadows[n]);

        shadows.splice(n, 1);
        console.log("REMOVED IT: ", shadows);
        currentTextStyle.shadow = shadows;
        doStuff();
        break;

      }

    }


  });




}
