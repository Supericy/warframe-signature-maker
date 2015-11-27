function initStatColorPickers(selector, color) {
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
        updateStatLayer();
      }
    });

    $this.spectrum('set', color);
  })
}

function initStatFontFamilies() {
  var fontTypes = [
    'Impact',
    'Georgia, serif',
    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    '"Times New Roman", Times, serif',
    'Arial, Helvetica, sans-serif',
    '"Arial Black", Gadget, sans-serif',
    '"Comic Sans MS", cursive, sans-serif',
    'Impact, Charcoal, sans-serif',
    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
    '"Courier New", Courier, monospace',
    '"Lucida Console", Monaco, monospace',
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
    strokWidth:$('#text-style-strokeWidth').val(),
    font: {
      family: $('#text-style-font-family').val()
    }
  };

  console.log(style);

  return style;
}


$(function() {
 var $canvas = $('#workspaceCanvas');

  initStatColorPickers('#stat-style-fillStyle');
  initStatColorPickers('#stat-style-strokeStyle');
  initStatColorPickers('#stat-style-color');
  initStatFontFamilies();


 
});


function updateStatLayer() {
  // use the specified style, or create it from the elements
  var layer = $canvas.selectedLayer;
  var style = getStatStyleFromElements();
  layer.style = style;
  var type = layer.name;
  var value = 10; // to do this sucks
  layer.source = createStatIconImage(type, value, style,function (dataUrl) {
          $this.attr('src', dataUrl);
          $this.click(function () {


              $canvas.insertImage($this[0], {
                  unique: true,
                  name: type.name,
                  style: style
              });
            var layer = $canvas.selectedLayer;
            $canvas.undoManager.add({
              undo: function() {
                deleteLayer(layer);
                $("#stat-toolbar").hide();

              },
              redo: function() {
                $canvas.addLayer(layer).drawLayers();
                $canvas.enableLayerHandles($canvas.selectedLayer, false);
                $canvas.selectedLayer = layer;
                 $("#stat-toolbar").show();
            }
           });


          });
      });
  
  $canvas.drawLayers();
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
  var newColor = color;//hexToRGB(document.getElementById("color").value);

  for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
  {
      if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
      {
          currentPixels.data[I] = originalPixels.data[I] / 255 * newColor.R;
          currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * newColor.G;
          currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * newColor.B;
      }
  }

  ctx.putImageData(currentPixels, 0, 0);
  return canvas.toDataURL("image/png");
}

function hexToRGB(hex)
{
  var long = parseInt(hex.replace(/^#/, ""), 16);
  return {
      R: (long >>> 16) & 0xff,
      G: (long >>> 8) & 0xff,
      B: long & 0xff
  };
}
