function initColorPickers(selector) {
  $(selector).spectrum({
    color: "#fff",
    containerClassName: "test",
    className: "test",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: false,
    showAlpha: true,
    maxSelectionSize: 10,
    chooseText: "Done",
    cancelText: "",
    preferredFormat: "rgba",
    localStorageKey: "spectrum.demo",
  });
}

$(function () {
  var $canvas = $('#workspaceCanvas');

  initColorPickers('.color-picker');

  $("#customize-text").dialog({
    autoOpen: false,
    title: "Text Effect Customizer",
    resizable: false,
    width: 'auto',
    modal: true,
    buttons: {
      OK: function () {
        var usernameLayer = $canvas.getLayer("usernameText");
        var shadows = [];
        $('#shadows .shadow').each(function () {
          var position = $(this).find('.text-style-shadow').val();
          var color = $(this).find('.text-style-shadow-color').val();
          shadows.push(position + ' ' + color);
        });

        var style = {
      		color: $('#customize-text-color').val(),
      		background: $('#customize-text-background').val(),
      		shadow: shadows
      	};
        currentTextStyle = style;
        console.log(style);

        // TODO: get the username from the same source as the other place
        usernameLayer.source = createTextEffect('SuperCoolGuy', style);
        $canvas.drawLayers();
        $(this).dialog("close");
      }
    },
    open: function (event, ui) {
      var shadows = currentTextStyle.shadow;
      // TODO: refactor... so ugly
      var $shadowBase = $(
        '<div class="shadow">' +
          '<input class="text-style-shadow" type="text">' +
          '<input class="text-style-shadow-color color-picker" type="text">' +
        '</div>');

        $('#shadows').empty();

        $('#customize-text-color').spectrum("set", currentTextStyle.color);
        $('#customize-text-background').spectrum("set", currentTextStyle.background);

        for (var n = 0, length = shadows.length; n < length; n ++) {
          // just turning "0 0 10px red" into ['0', '0', '10px', 'red']
          var chunks = shadows[n].split(' ');
          var shadowColor = chunks.pop();
          var shadowPosition = chunks.join(' ');

          var $shadow = $shadowBase.clone();
          $('#shadows').append($shadow);

          $shadow.find('.text-style-shadow').val(shadowPosition);
          $shadow.find('.text-style-shadow-color').data("color", shadowColor);
        }

        // TODO: yuck...
        $('#shadows .shadow .text-style-shadow-color').each(function () {
          initColorPickers(this);
          $(this).spectrum("set", $(this).data("color"));
        });
    }
  });
  $("#customize-text-opener").click(function() {
    $("#customize-text").dialog("open");
  });
});
