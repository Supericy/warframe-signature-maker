function initColorPickers(selector, color) {
  var $elm = $(selector);

  $elm.each(function () {
    var $this = $(this);

    $this.spectrum({
      color: color || "#fff",
      containerClassName: "color-picker-popup",
      className: "color-picker-button",
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
        $this.val(color);
        updateTextLayer();
      }
    });

    $this.spectrum('set', color);
  })
}

$(function() {
  var $canvas = $('#workspaceCanvas');
  // initColorPickers('.color-picker');
  initColorPickers('#text-style-color');

  $('#text-style-font-family').keyup(updateTextLayer);
});

function getStyleFromElements() {
  var usernameLayer = $canvas.getLayer("usernameText");
  var shadows = [];
  $('#shadows .shadow').each(function() {
    // basically just calls '.val()' on all elements with the class
    var shadow = $(this).find('.text-style-shadow').map(function () {
      return $(this).val();
    }).get();

    shadows.push(shadow.join(' '));
  });

  var style = {
    color: $('#text-style-color').spectrum('get'),
    font: {
      family: $('#text-style-font-family').val()
    },
    shadow: shadows
  };

  console.log(style);

  return style;
}

function createElementsFromStyle(style) {
  var $shadowParent = $('#shadows');
  var $shadowBase = $($('#shadow-template').html());

  $shadowParent.empty();

  // set font color and
  $('#text-style-color').spectrum("set", style.color);
  $('#text-style-font-family').val(style.font.family);

  for (var n = 0, length = style.shadow.length; n < length; n++) {
    // just turning "0 0 10px red" into ['0', '0', '10px', 'red']
    var chunks = style.shadow[n].split(' ');

    var $shadow = $shadowBase.clone();
    $shadow.find('.text-style-shadow-horizontal').val(chunks[0]);
    $shadow.find('.text-style-shadow-vertical').val(chunks[1]);
    $shadow.find('.text-style-shadow-blur').val(chunks[2]);
    initColorPickers($shadow.find('.text-style-shadow-color'), chunks[3]);

    $shadow.keyup(function() {
      updateTextLayer();
    });

    $shadowParent.append($shadow);
  }

  $shadowParent.find('.customize-remove-shadow').on('click', function(e, p) {
    $(this).closest('.shadow').remove();
    updateTextLayer();
  });

  // add the plus button!
  var $shadowAdd = $($('#shadow-template-add-button').html());
  $shadowAdd.click(function () {
    var style = getStyleFromElements();
    style.shadow.push('0px 0px 0px #fff');
    createElementsFromStyle(style);
  })
  $shadowParent.append($shadowAdd)
}

function updateTextLayer() {
  // use the specified style, or create it from the elements
  var style = getStyleFromElements();

  var usernameLayer = $canvas.getLayer("usernameText");
  usernameLayer.source = createTextEffect($canvas.data("username"), style);
  $canvas.drawLayers();
}
