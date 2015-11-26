var STAT_TYPES = {
    'KILL': {
        'name': 'kill',
        'icon': 'images/statIcons/kill.png'
    },
    'GRENADE': {
        'name': 'kill_grenade',
        'icon': 'images/statIcons/kill_grenade.png'
    },
    'KNIFE': {
        'name': 'kill_melee',
        'icon': 'images/statIcons/kill_melee.png'
    },
    'HEADSHOT': {
        'name': 'kill_headshot',
        'icon': 'images/statIcons/kill_headshot.png'
    },
    'PIERCE': {
        'name': 'two_at_once_kill',
        'icon': 'images/statIcons/two_at_once_kill.png'
    },
    'SLIDE': {
        'name': 'kill_in_slide',
        'icon': 'images/statIcons/kill_in_slide.png'
    },
    'DEFIB': {
        'name': 'defibrillator_kill',
        'icon': 'images/statIcons/defibrillator_kill.png'
    }
};

$(function () {

    var a = new Image();
    a.src = STAT_TYPES.KILL.icon;
});

function createStatIconImage(type, value, fillStyle, strokwWidth, strokeStyle, fontFamily, callback) {
    var $statCanvas = $('<canvas height="100px" width="220px" />');

    
    var img = new Image();
    img.src = type.icon;
    img.onload = function(){

        console.log("img loaded");
        var fontSize = 42;
       
        var numDigits = value.toString().length;
        var padding = 15 * numDigits; // function of the # digits
        var imgWidth = img.width*0.5;
        var imgHeight = img.height*0.5;
       
        
        var textWidth = fontSize/3 * numDigits; // guestimate since other methods require using canvas width/height which server can't do
        

        console.log("textwidth: for ", value + " is " , textWidth);
        $statCanvas[0].width = textWidth + imgWidth + padding;//todo make these relative
        $statCanvas[0].height = imgHeight;

        $statCanvas.drawText({
            fillStyle: fillStyle,
            strokeStyle: strokeStyle,
            strokeWidth: strokwWidth,
            x: imgWidth+padding, y: $statCanvas[0].height/2,
            fontSize: fontSize,
            fontFamily: fontFamily,
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
