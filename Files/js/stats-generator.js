var STAT_TYPES = {
    'KILL': {
        'name': 'kill',
        'icon': 'images/statIcons/kill.png'
    }
};

function createStatIconImage(type, value, callback) {
    var imgWidth = 180;
    var imgHeight = 116;
    var fontSize = 48;

    // create our stat image
    // var $statCanvas = $('<canvas width="300px" height="116px"></canvas>');
    var $statCanvas = $('<canvas height="116px" width="220px"/>');
    var can = $statCanvas[0];
    var callback = callback || function(a) {};

    // todo: make font look better
    var ctx = can.getContext('2d');
    ctx.font = "48px serif";
    ctx.fillStyle = "white";
    // Specify the shadow colour.
ctx.shadowColor = "black";

// Specify the shadow offset.
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
    ctx.fillText(value, imgWidth, 90-18);

    var img = new Image();
    img.src = type.icon;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 180, 116);
        // var dataUrl = trim(can).toDataURL();
        var dataUrl = can.toDataURL();
        console.log(dataUrl);
        callback(dataUrl);
    };
}
