function initStatColorPickers(selector, color) {
  var $elm = $(selector);

  $elm.each(function() {
    var $this = $(this);
    color =  color || tinycolor('gray');
    $this.spectrum({
      color: color,
      containerClassName: "color-picker-popup",
      className: "color-picker-button",
      showInitial: true,
      showPalette: false,
      showSelectionPalette: false,
      showAlpha: false,
      maxSelectionSize: 10,
      chooseText: "Done",
      cancelText: "",
      preferredFormat: "rgb",
      localStorageKey: "spectrum.demo",

      move: function(color) {
        $this.val(color);
        updateStatLayer();
      }
    });

    $this.spectrum('set', color);
  })
}

function initStatFontFamilies() {
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
  var $statStyleFontFamily = $('#stat-style-font-family');
  for (var n = 0, length = fontTypes.length; n < length; n++) {
    var fontFamily = fontTypes[n];
    var $elm = $('<option></option>');
    $elm
      .val(fontFamily)
      .text(fontFamily)
      .css({
        'font-family': fontFamily
      });
    $statStyleFontFamily.append($elm);
  }
  $statStyleFontFamily.change(updateStatLayer);
}


function getStatStyleFromElements() {
  
  var style = {
    iconColor: $('#stat-style-color').spectrum('get'),
    fillStyle: $('#stat-style-fillStyle').spectrum('get'),
    strokeStyle: $('#stat-style-strokeStyle').spectrum('get'),
    strokeWidth:$('#stat-style-strokeWidth').slider("option", "value"),
    //font: {
   //   family: $('#stat-style-font-family').val()
    //}
  };
  console.log("style from elements:");
  console.log(style);

  return style;
}


$(function() {
  //var $canvas = $('#workspaceCanvas');

  initStatColorPickers('#stat-style-fillStyle');
  initStatColorPickers('#stat-style-strokeStyle');
  initStatColorPickers('#stat-style-color');
  //initStatFontFamilies();


  var $strokeWidthSlider = $('#stat-style-strokeWidth');
  $strokeWidthSlider.slider({
    min: 0,
    max: 10,
    step: 1,
    slide: function(event, ui) {
      updateStatLayer();
    }
  });


 
});

function updateStatToolbar() {

  var layer = $canvas.selectedLayer;
  var style = layer.style;
  //console.log("updating toolbar for layer" + layer.name);
  //console.log(style);

  $('#stat-style-color').spectrum('set', style.iconColor);
  $('#stat-style-fillStyle').spectrum('set', style.fillStyle);
  $('#stat-style-strokeStyle').spectrum('set', style.strokeStyle);
  $('#stat-style-strokeWidth').slider("value", style.strokeWidth);
  //$('#stat-style-font-family').val(style.font.family);
    

}

function updateStatLayer() {
  // use the specified style, or create it from the elements
  console.log("updating stat layer");
  var layer = $canvas.selectedLayer;
  var style = getStatStyleFromElements();
  layer.style = style;
  var type = STAT_TYPES[layer.name];
  var $element = $('.stat-icon-preset');
  var value = 10;

  for(var i = 0; i <$element.length; i++){
    var $test = $($element[i]);
    if($test.data('stat-type') === layer.name){
      value = $test.data('stat-value');
    }
  }
  createStatIconImage(type, value, style, function(dataURL){
    layer.source = dataURL;
    $canvas.drawLayers();
    //console.log("after update draw");
    //console.log(layer.style);
  });
  
}


function changeStatIconColor(img, color){
  // assumes the icon is already loaded

   var $statCanvas = $('<canvas height="100px" width="220px" />');
  $statCanvas[0].width = img.width;
  $statCanvas[0].height = img.height;

  var canvas = $statCanvas[0];
  var ctx = canvas.getContext("2d");
  var originalPixels = null;
  var currentPixels = null;


  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
  originalPixels = ctx.getImageData(0, 0, img.width, img.height);
  currentPixels = ctx.getImageData(0, 0, img.width, img.height);

  img.onload = null;

 // if(!originalPixels) return; // Check if image has loaded
  var newColor = tinyToRGB(color);
  //console.log("new color");console.log(newColor);

  for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
  {
      if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
      {
          currentPixels.data[I] = /*originalPixels.data[I] / 255 **/ newColor.R;
          currentPixels.data[I + 1] = /*originalPixels.data[I + 1] / 255 **/ newColor.G;
          currentPixels.data[I + 2] = /*originalPixels.data[I + 2] / 255 **/ newColor.B;
      }
  }

  ctx.putImageData(currentPixels, 0, 0);
  return canvas.toDataURL("image/png");
}

function tinyToRGB(tiny)
{
  //var long = parseInt(hex.replace(/^#/, ""), 16);
  var test = tiny.toRgb();
  return {
      R: test.r,//(long >>> 16) & 0xff,
      G: test.g,//(long >>> 8) & 0xff,
      B: test.b,//long & 0xff
  };
}
