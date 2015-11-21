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

function createStatIconImage(type, value, callback) {

    var img = new Image();
    img.src = type.icon;
      
    img.onload = function() {

        var imgWidth = img.width;
        var imgHeight = img.height;
        var fontSize = 72;

        // create our stat image
        // var $statCanvas = $('<canvas width="300px" height="116px"></canvas>');
        var $statCanvas = $('<canvas id="statCanvas" height="116px" width="220px"/>');
        var can = $statCanvas[0];
        var callback = callback || function(a) {};

        // todo: make font look better
        var ctx = can.getContext('2d');
        ctx.font = "72px serif";
        ctx.fillStyle = "white";
        // Specify the shadow colour.
        ctx.shadowColor = "black";

        // Specify the shadow offset.
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(value, imgWidth, imgHeight-18);

        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        var dataUrl = trim(can).toDataURL();
        //var dataUrl = can.toDataURL();
        console.log(dataUrl);
        callback(dataUrl);
    };
}
