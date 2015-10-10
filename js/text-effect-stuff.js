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
      $(this).val(color);
      updateTextLayer();
    }
  });
}

$(function() {
  var $canvas = $('#workspaceCanvas');

  initColorPickers('#customize-text-color');

  $('.customize-add-shadow').click(function() {
    var style = getStyleFromElements();
    style.shadow.push('0px 0px 0px #fff');
    createElementsFromStyle(style);
  });
});

function getStyleFromElements() {
  var usernameLayer = $canvas.getLayer("usernameText");
  var shadows = [];
  $('#shadows .shadow').each(function() {
    // basically just calls '.val()' on all elements with the class
    var shadow = $(this).find('.text-style-shadow').map(function () {
      return $(this).val();
    }).get();

    console.log(shadow);

    shadows.push(shadow.join(' '));
  });

  var style = {
    color: $('#customize-text-color').spectrum('get'),
    shadow: shadows
  };

  return style;
}

function createElementsFromStyle(style) {
  var $shadowParent = $('#shadows');
  var $shadowBase = $($('#shadow-template').html());

  $shadowParent.empty();

  // set font color
  $('#customize-text-color').spectrum("set", style.color);

  // TODO: load from style
  // set font type
  $('#customize-text-font').val("I'M A FONT");

  for (var n = 0, length = style.shadow.length; n < length; n++) {
    // just turning "0 0 10px red" into ['0', '0', '10px', 'red']
    var chunks = style.shadow[n].split(' ');
    // var shadowColor = chunks.pop();
    var shadowPosition = chunks.join(' ');

    var $shadow = $shadowBase.clone();

    $shadow.find('.text-style-shadow-horizontal').val(chunks[0]);
    $shadow.find('.text-style-shadow-vertical').val(chunks[1]);
    $shadow.find('.text-style-shadow-blur').val(chunks[2]);
    $shadow.find('.text-style-shadow-color').data("color", chunks[3]);

    $shadow.keyup(function() {
      updateTextLayer();
    });

    $shadowParent.append($shadow);
  }

  $shadowParent.find('.customize-remove-shadow').on('click', function(e, p) {
    $(this).closest('.shadow').remove();
    updateTextLayer();
  });

  // TODO: yuck... can probably use shadowID to filter this now?
  $shadowParent.find('.text-style-shadow-color').each(function() {
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
