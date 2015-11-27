$(function() {
 
 
});


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
