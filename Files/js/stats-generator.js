var STAT_TYPES = {
    'kill': {
        'name': 'kill',
        'icon': 'images/statIcons/kill.png'
    },
    'kill_grenade': {
        'name': 'kill_grenade',
        'icon': 'images/statIcons/kill_grenade.png'
    },
    'kill_melee': {
        'name': 'kill_melee',
        'icon': 'images/statIcons/kill_melee.png'
    },
    'kill_headshot': {
        'name': 'kill_headshot',
        'icon': 'images/statIcons/kill_headshot.png'
    },
    'two_at_once_kill': {
        'name': 'two_at_once_kill',
        'icon': 'images/statIcons/two_at_once_kill.png'
    },
    'kill_in_slide': {
        'name': 'kill_in_slide',
        'icon': 'images/statIcons/kill_in_slide.png'
    },
    'defibrillator_kill': {
        'name': 'defibrillator_kill',
        'icon': 'images/statIcons/defibrillator_kill.png'
    }
};

$(function () {

    var a = new Image();
    a.src = STAT_TYPES.kill.icon;
});

function createStatIconImage(type, value, style, callback) {
    var $statCanvas = $('<canvas height="100px" width="220px" />');

    var img = new Image();
    img.src = type.icon;
    img.onload = function(){

        console.log("icon color" +style.iconColor);
        var newColor = style.iconColor || tinycolor('gray');

        img.src = changeStatIconColor(img, style.iconColor);

        var fontSize = 42;
       
        var numDigits = value.toString().length;
        var padding = 15 * numDigits; // function of the # digits
        var imgWidth = img.width*0.5;
        var imgHeight = img.height*0.5;
       
        // to do get this stuff from a temp canvas as its not going to work after all
        var textWidth = fontSize/3 * numDigits; // guestimate since other methods require using canvas width/height which server can't do
        

        //console.log("textwidth: for ", value + " is " , textWidth);
        $statCanvas[0].width = textWidth + imgWidth + padding;//todo make these relative
        $statCanvas[0].height = imgHeight;

        if(style.fillStyle)
        {
            style.fillStyle = style.fillStyle.toHexString();
        }
        if(style.strokeStyle)
        {
            style.strokeStyle = style.strokeStyle.toHexString();
        }
        $statCanvas.drawText({
            fillStyle: style.fillStyle || 'orange',
            strokeStyle: style.strokeStyle || 'black',
            strokeWidth: style.strokeWidth || 2,
            x: imgWidth+padding, y: $statCanvas[0].height/2,
            fontSize: fontSize,
            fontFamily: style.font.family || 'Impact',
            text: value.toString()
        });

        $statCanvas.drawImage({
            source: img,
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            fromCenter: false,
            load: function () {
                callback($statCanvas.getCanvasImage('png'));
            }
        });
    };
}


function updateIntermediateStatIcon(lay, callback){
       
        var img = new Image();
        img.source = STAT_TYPES[lay.name].icon;
        img.onload = function(){

            var newColor = style.iconColor || {_r:152, _g:152, _b:152};

            var numDigits = value.toString().length;
            //var padding = 15 * numDigits; // function of the # digits

            var imgWidth = lay.height * (img.width/img.height);//img.width*0.5;
            var imgHeight = lay.height;//img.height*0.5;
           

            var fontSize = imgHeight - 18;//42;

            var textWidth = fontSize/3 * numDigits; // guestimate since other methods require using canvas width/height which server can't do
            
            var vTextOffset = fontSize/15;

            var padding = imgWidth/8 * numDigits;

            // FIXING THINGS
            lay.height =  imgHeight;
            lay.width = textWidth + imgWidth + padding;
            var $statCanvas = $('<canvas height=' + lay.height + 'px width=' + lay.width + 'px" />');
            $statCanvas[0].width = textWidth + imgWidth + padding;//todo make these relative
            $statCanvas[0].height = imgHeight;
        
            if(numDigits > 2){
                lay.x = lay.x + padding/2;
            }
            

            if(style.fillStyle)
            {
                style.fillStyle = tinyToRGBString(style.fillStyle);
            }
            if(style.strokeStyle)
            {
                style.strokeStyle = tinyToRGBString(style.strokeStyle);
            }
            //console.log(style.strokeStyle);
            $statCanvas.drawText({
                fillStyle: style.fillStyle || 'orange',
                strokeStyle:style.strokeStyle || 'black',
                strokeWidth: style.strokeWidth || 2,
                x: imgWidth+padding, y: lay.height/2-vTextOffset, 
                fontSize: fontSize,
                fontFamily: style.font.family || 'Impact',
                text: value
            });

            img.src = changeStatIconColor(img, style.iconColor, $);
            
            $statCanvas.drawImage({
                source: img,
                x: 0 ,
                y: 0,
                width: imgWidth,
                height: imgHeight,
                fromCenter: false,
                load: function () {
                    callback($statCanvas.getCanvasImage('png'));
                }
            });
        }

}


function tinyToRGB(tiny)
{
  //var long = parseInt(hex.replace(/^#/, ""), 16);
  var test = tiny;//.toRgb(); god damn node
  
  return {
      R: test._r,//(long >>> 16) & 0xff,
      G: test._g,//(long >>> 8) & 0xff,
      B: test._b,//long & 0xff
  };
}

function tinyToRGBString(tiny)
{
    return tiny;
  //var long = parseInt(hex.replace(/^#/, ""), 16);
  console.log(tiny);
  var test = tiny;//.toRgb(); god damn node
  if(test){
  return "rgb(" + test._r + "," + test._g + "," + test.b + ")";}
  else return null;
  
}