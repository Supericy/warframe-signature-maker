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


  var $c  = $( '<canvas>' );

  // hack required by width/height bug in jsdom/node-canvas integration
  $c[0].width = 400;
  $c[0].height = 300;
  var document = window.document;
  Image = canvas.Image;

    var img = new Image();
    img.src = '../../images/extras/extras-9.png';

    var can = $c[0];
    var ctx = can.getContext('2d');

    fs.readFile(__dirname + '../../images/extras/extras-9.png', function(err, squid){
    if (err) throw err;
      img = new Image;
      img.src = squid;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    //   console.warn( 'Paste the following as a url in your browser.' );
      console.log(can.toDataURL());

  });



});
