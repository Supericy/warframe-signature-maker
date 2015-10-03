/// CSS text-effects in <canvas>

/// Shadow-based effects (parsing popular css-based text-effects)

var textEffectStyles = {
	// http://simurai.com/post/802968365/css3d-css3-3d-text
	"Stereoscopic": {
		color: "#000",
		background: "#fff",
		shadow: "-0.06em 0 0 red, 0.06em 0 0 cyan"
	},
	// http://line25.com/articles/using-css-text-shadow-to-create-cool-text-effects
	"Neon": {
		color: "#FFF",
		background: "#000",
		shadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de"
	},
	"Anaglyphic": {
		color: "rgba(0,0,255,0.5)",
		background: "#fff",
		shadow: "3px 3px 0 rgba(255,0,180,0.5)"
	},
	"VintageRadio": {
		color: "#707070",
		background: "#ddd",
		shadow: "2px 2px 0px #eee, 4px 4px 0px #666"
	},
	"Inset": {
		color: "#222",
		background: "#444",
		shadow: "0px 1px 1px #777"
	},
	// meinen kopf
	"Shadow": {
		color: "#444",
		background: "#444",
		shadow: "0 0 11px #000"
	},
	"Shadow2": {
		background: "#ddd",
		shadow: "0 0 11px #000"
	},
	// http://pgwebdesign.net/blog/3d-css-shadow-text-tutorial
	"Shadow3D": {
		color: "#fff",
		background: "#ddd",
		shadow: "1px -1px #444, 2px -2px #444, 3px -3px #444, 4px -4px #444"
	}
};




function createTextEffect(text, style, fontFamily) {
	var canvas = document.createElement('CANVAS');
	canvas.width = 300;
	canvas.height = 100;
	var metrics = {
		direction: 'ltr',
		top: 0,
		em: 40,
		middle: 0,
		bottom: 0,
		height: 100,
		width: 300
	};

	function parseShadow(shadows) {
		shadows = shadows.split(", ");
		var ret = [];
		for (var n = 0, length = shadows.length; n < length; n ++) {
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
	ctx.font = "43px " + fontFamily;
	// absolute position of the text (within a translation state)
	var offsetX = 20;
	var offsetY = 60;
	// gather information about the height of the font
	var textHeight = metrics.height * 1.20;

	var width = ctx.measureText(text).width;



	// add a background to the current effect
	//ctx.fillStyle = style.background;
	//ctx.fillRect(0, 0, ctx.canvas.width, textHeight - 1)
	// parse text-shadows from css
	var shadows = parseShadow(style.shadow);
	// loop through the shadow collection
	var n = shadows.length;

	while(n--) {
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
			ctx.fillText(text, offsetX + (shadow.x||0), offsetY - (shadow.y||0) + metrics.top);
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
	

	return canvas.toDataURL("png");
}
