/// CSS text-effects in <canvas>

/// Shadow-based effects (parsing popular css-based text-effects)

var textEffectStyles = {
  // http://simurai.com/post/802968365/css3d-css3-3d-text
  "Firey": {
    color: "#FFF",
    shadow: [
      "0px -1px 4px white",
      "0px -2px 10px yellow",
      "0px -10px 20px #ff8000",
      "0px -18px 40px red"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Real3D": {
    color: "#FFF",
    shadow: [
      "0px -1px 0px #999",
      "0px -2px 0px #888",
      "0px -3px 0px #777",
      "0px -4px 0px #666",
      "0px -5px 0px #555",
      "0px -6px 0px #444",
      "0px -7px 0px #333",
      "0px 8px -7px #001135"
    ],
    font: {
      family: 'Impact'
    }
  },
  // http://line25.com/articles/using-css-text-shadow-to-create-cool-text-effects
  "Neon": {
    color: "#ffffff",
    shadow: [
      "0 0 10px #000",
      "0 0 20px #ff0000",
      "0 0 30px #ff0000",
      "0 0 40px #dd0000",
      "0 0 70px #de0000",
      "0 0 80px #ee000",
      "0 0 100px #ff0000",
      "0 0 150px #ff0000"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Anaglyphic": {
    color: "rgba(0,0,255,0.5)",
    shadow: [
      "-1px -1px 1px #fff",
      "1px 1px 1px #00f",
    ],
    font: {
      family: 'Impact'
    }
  },
  "VintageRadio": {
    color: "rgba(255,255,255,0.1)",
    shadow: [
      "0px 0px 10px rgba(255,255,255,0.6)",
      "0px 0px 30px rgba(255,255,255,0.4)",
      "0px 0px 50px rgba(255,255,255,0.3)",
      "0px 0px 180px rgba(255,255,255,0.3)"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Inset": {
    color: "#222",
    shadow: [
      "0px 1px 1px #777"
    ],
    font: {
      family: 'Impact'
    }
  },
  // meinen kopf
  "Shadow": {
    color: "#444",
    shadow: [
      "0 0 11px #000"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Shadow2": {
    color: "rgba(255,255,255,0.5)",
    shadow: [
      "-1px -1px 0 #000",
      "1px -1px 0 #000",
      "-1px 1px 0 #000",
      "1px 1px 0 #000"
    ],
    font: {
      family: 'Impact'
    }
  },
  // http://pgwebdesign.net/blog/3d-css-shadow-text-tutorial
  "Shadow3D": {
    color: "#fff",
    shadow: [
      "1px -1px #444",
      "2px -2px #444",
      "3px -3px #444",
      "4px -4px #444"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Shadow3": {
    color: "#rgba(0,50,125,0.4)",
    shadow: [
      "1px 1px 0 #767676",
      "-1px 1px 1px #737272",
      "-2px 1px 1px #767474",
      "-3px 1px 1px #787777",
      "-4px 1px 1px #7b7a7a",
      "-5px 1px 1px #7f7d7d",
      "-6px 1px 1px #828181",
    ],
    font: {
      family: 'Impact'
    }
  },
  "SoftEmboss": {
    color: "rgba(0,0,0,0.6)",
    shadow: [
      "2px 8px 6px rgba(0,0,0,0.2)",
      "0px -5px 35px rgba(255,255,255,0.3)"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Reflection": {
    color: "#000",
    shadow: [
      "0px -36px 0px #fff"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Flame2": {
    color: "#000",
    shadow: [
      "0 0 4px #ccc",
      "0 -5px 4px #ff3",
      "2px -10px 6px #fd3",
      "-2px -15px 11px #f80",
      "2px -18px 18px #f20"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Other3D": {
    color: "rgba(0,0,0,0.6)",
    shadow: [
      "-1px -1px 0  #6E981B",
      "-2px -2px 1px  #6E981B",
      "-2px -2px 2px #6E981B",
      "-2px -2px 0 7px #FCFCE8",
      "-3px -3px 0 7px #AFAF9D",
      "-4px -4px 0 7px #AFAF9D",
      "-5px -5px 0 7px #AFAF9D",
      "-6px -6px 0 7px #AFAF9D",
      "-7px -7px 4px 8px #70705C",
      "-8px -8px 6px 9px #989881"
    ],
    font: {
      family: 'Impact'
    }
  },
  "Chocolate": {
    color: "#662200",
    shadow: [
      "0 0 1px #5C1F00",
      "-1px 1px 0px #5C1F00",
      "-2px 2px 2px #5C1F00",
      "-4px 4px 2px #5C1F00",
      "-6px 6px 3px #421600",
      "-8px 8px 2px #2E0F00",
      "-10px 10px 3px #290E00",
      "-12px 12px 2px #290E00",
      "-14px 14px 2px #1A0900",
      "-15px 15px 2px #1A0900",
      "-15px 15px 0px rgba(38,21,13,0.25)"
    ],
    font: {
      family: 'Impact'
    }
  }
};




function createTextEffect(text, style) {
  // default font if the style doesn't provide one
  // style.font = style.font || {
  //   family: 'Impact'
  // };

  var canvas = document.createElement('CANVAS');
  canvas.width = 1200;
  canvas.height = 1200;
  var metrics = {
    direction: 'ltr',
    top: 0,
    em: 40,
    middle: 0,
    bottom: 0,
    height: 1200,
    width: 1200
  };

  function parseShadow(shadows) {
    // shadows = shadows.split(", ");
    var ret = [];
    for (var n = 0, length = shadows.length; n < length; n++) {
      var shadow = shadows[n].split(" ");
      var type = shadow[0].replace(parseFloat(shadow[0]), "");
      if (type == "em") {
        var obj = {
          x: metrics.em * parseFloat(shadow[0]),
          y: metrics.em * parseFloat(shadow[1])
        };
      } else {
        var obj = {
          x: parseFloat(shadow[0]),
          y: parseFloat(shadow[1])
        };
      }
      if (shadow[3]) {
        obj.blur = parseFloat(shadow[2]);
        obj.color = shadow[3];
      } else {
        obj.blur = 0;
        obj.color = shadow[2];
      }
      ret.push(obj);
    }
    return ret;
  };

  var ctx = canvas.getContext('2d');
  ctx.save();
  ctx.font = "100px " + style.font.family;
  // absolute position of the text (within a translation state)
  var offsetX = 400;
  var offsetY = 400;
  // gather information about the height of the font
  var textHeight = metrics.height * 1.20;

  var width = ctx.measureText(text).width;

  // parse text-shadows from css
  var shadows = parseShadow(style.shadow);
  // loop through the shadow collection
  var n = shadows.length;

  while (n--) {
    var shadow = shadows[n];
    var totalWidth = width + shadow.blur * 2;



    ctx.save();
    ctx.beginPath();
    ctx.rect(offsetX - shadow.blur, 0, offsetX + totalWidth, textHeight);
    ctx.clip();
    if (shadow.blur) { // just run shadow (clip text)
      ctx.shadowColor = shadow.color;
      ctx.shadowOffsetX = shadow.x + totalWidth;
      ctx.shadowOffsetY = shadow.y;
      ctx.shadowBlur = shadow.blur;
      ctx.fillText(text, -totalWidth + offsetX, offsetY + metrics.top);
    } else { // just run pseudo-shadow
      ctx.fillStyle = shadow.color;
      ctx.fillText(text, offsetX + (shadow.x || 0), offsetY - (shadow.y || 0) + metrics.top);
    }
    ctx.restore();
  }
  // drawing the text in the foreground
  if (style.color) {
    ctx.fillStyle = style.color;
    ctx.fillText(text, offsetX, offsetY + metrics.top);
  }
  // jump to next em-line
  ctx.translate(0, textHeight);

  ctx.restore();


  return trim(canvas).toDataURL("png");
}

function trim(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  var trimHeight = bound.bottom - bound.top,
    trimWidth = bound.right - bound.left,
    trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // open new window with trimmed image:
  return copy.canvas;
}
