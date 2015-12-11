function initColorPickers(selector, color) {
  var $elm = $(selector);

  $elm.each(function() {
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

function initFontFamilies() {
  var fontTypes = [
      'defused',
      'dayslater',
      'ascent2stardom',
      'blade2',
      'drifttype',
      'heavymetal',
      'infected',
      'topsecret',
      'trashco',
      'Impact'
  ];
  var $textStyleFontFamily = $('#text-style-font-family');
  for (var n = 0, length = fontTypes.length; n < length; n++) {
    var fontFamily = fontTypes[n];
    var $elm = $('<option></option>');
    $elm
      .val(fontFamily)
      .text(fontFamily)
      .css({
        'font-family': fontFamily
      });
    $textStyleFontFamily.append($elm);
  }
  $textStyleFontFamily.change(updateTextLayer);
}

function getStyleFromElements() {
  var usernameLayer = $canvas.getLayer("usernameText");
  var shadows = [];
  $('#textShadows .shadow').each(function() {
    // basically just calls '.val()' on all elements with the class
    var shadow = $(this).find('.text-style-shadow').map(function() {
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

  console.log("creating elements from style: " + style);
  var $shadowParent = $('#textShadows');
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

    $shadow.on('click', '.customize-remove-shadow', function () {
      var $parent = $(this).closest('.shadow');
      $parent.hide('fade', 100, function () {
        $parent.remove();
        updateTextLayer();
      });
    });

    $shadowParent.append($shadow);
  }
}

function updateTextLayer() {
  // use the specified style, or create it from the elements
  var usernameLayer = $canvas.getLayer("usernameText");
  var style = getStyleFromElements();
  var username = localStorage.getItem("username");
  console.log("style is : " + style);
  usernameLayer.style = style;
  console.log("update text layer calling create");
  usernameLayer.source = createTextEffect(username, style);
  
  $canvas.drawLayers();
}

$(function() {
 
 
  initColorPickers('#text-style-color');
  initFontFamilies();



  $('body').on('click', '.customize-add-shadow', function() {
    var usernameLayer = $canvas.getLayer("usernameText");
    var style = getStyleFromElements();
    style.shadow.push('0px 0px 0px #fff');
    createElementsFromStyle(style);
    layer.style = style;
  });
});
