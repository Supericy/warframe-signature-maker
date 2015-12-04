var jsdom = require('jsdom');
var fs = require('fs');
var JQuery = require( 'jquery' );
var JCanvas = require( 'jcanvas' );


var html = '<html><body><canvas id="cx" width="400" height="300"></canvas></body></html>';

var canvas = require('canvas');
//window.Image = canvas.Image;

jsdom.env( html, function ( errors, window ) {
  if( errors ) console.log( errors );
  window.window = window;
  //window.Image = canvas.Image;
  var $ = JQuery( window );
  JCanvas( $, window);

  var value = 5;

  var $statCanvas = $('<canvas height="116px" width="220px" />');

  $statCanvas[0].width = 200;
  $statCanvas[0].height = 200;

 
    squid = fs.readFileSync(__dirname + '../../images/extras/extras-9.png');//, function(err, squid) {
        $statCanvas.drawText({
            fillStyle: '#9cf',
            strokeStyle: '#25a',
            strokeWidth: 2,
            x: 150, y: 50,
            fontSize: 48,
            fontFamily: 'Verdana, sans-serif',
            text: value
        });

        console.log('attempting to draw image');
        var img = new canvas.Image();
        img.src = squid;
        //var cx = window.document.getElementsByTagName( 'canvas' )[ 0 ];
        //cx.setAttribute( 'width', 700 );
        $statCanvas.drawImage({
            source: img,
            x: 0,
            y: 0,
            width: 700,
            height: 116,
            fromCenter: false,
            load: function () {
                console.log($statCanvas.getCanvasImage('png'));
                // console.log($statCanvas[0].toDataURL());
            }
        })

        // setTimeout(function () {
        //     console.log($statCanvas.getCanvasImage('png'));
        // }, 2000);
    //});



  // hack required by width/height bug in jsdom/node-canvas integration
  // $c[0].width = 400;
  // $c[0].height = 300;
  // var document = window.document;
  // Image = canvas.Image;
  //
  //   var img = new Image();
  //   img.src = '../../images/extras/extras-9.png';
  //
  //   var can = $c[0];
  //   var ctx = can.getContext('2d');
  //
  //   fs.readFile(__dirname + '../../images/extras/extras-9.png', function(err, squid){
  //   if (err) throw err;
  //     img = new Image;
  //     img.src = squid;
  //     ctx.drawImage(img, 0, 0, img.width, img.height);
  //   //   console.warn( 'Paste the following as a url in your browser.' );
  //     console.log(can.toDataURL());
  //
  // });



});
