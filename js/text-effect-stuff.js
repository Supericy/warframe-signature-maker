function initColorPickers(selector, color) {
  var $elm = $(selector);

  $elm.spectrum({
    color: color || "#fff",
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
      updateTextLayer();
    }
  });
}

$(function() {
  var $canvas = $('#workspaceCanvas');

  initColorPickers('#customize-text-color');
});

function getStyleFromElements() {
  var usernameLayer = $canvas.getLayer("usernameText");
  var shadows = [];
  $('#shadows .shadow').each(function() {
    var position = $(this).find('.text-style-shadow').val();
    var color = $(this).find('.text-style-shadow-color').val();
    var shadow = position + ' ' + color;
    shadows.push(shadow);
  });

  var style = {
    color: $('#customize-text-color').spectrum('get'),
    shadow: shadows
  };

  return style;
}

function createElementsFromStyle(style) {
  var $shadowParent = $('#shadows');
  var $shadowBase = $(
    '<div class="shadow">' +
    '<input class="text-style-shadow" type="text">' +
    '<input class="text-style-shadow-color color-picker" type="text">' +
    '<button type="button" class="removeShadowButton">Remove</button>' +
    '</div>');

  $shadowParent.empty();

  // set font color
  $('#customize-text-color').spectrum("set", style.color);

  // TODO: load from style
  // set font type
  $('#customize-text-font').val("I'M A FONT");

  for (var n = 0, length = style.shadow.length; n < length; n++) {
    // just turning "0 0 10px red" into ['0', '0', '10px', 'red']
    var chunks = style.shadow[n].split(' ');
    var shadowColor = chunks.pop();
    var shadowPosition = chunks.join(' ');

    var $shadow = $shadowBase.clone();

    $shadowParent.append($shadow);

    $shadow.find('.text-style-shadow').val(shadowPosition);
    $shadow.find('.text-style-shadow-color').data("color", shadowColor);
  }

  $shadowParent.find('.shadow .removeShadowButton').on('click', function(e, p) {
    $(this).parent().remove();
    updateTextLayer();
  });

  // TODO: yuck... can probably use shadowID to filter this now?
  $('#shadows .shadow .text-style-shadow-color').each(function() {
    initColorPickers(this);
    $(this).spectrum("set", $(this).data("color"));
  });
}

function updateTextLayer(style) {
  // use the specified style, or create it from the elements
  style = style || getStyleFromElements();

  var usernameLayer = $canvas.getLayer("usernameText");
  usernameLayer.source = createTextEffect($canvas.data("username"), style);
  $canvas.drawLayers();
}
