

var jsdom = require('jsdom'),
    JQuery = require( 'jquery' ),
    JCanvas = require( 'jcanvas' ),
    html = '<html><body><canvas id="cx" width="400" height="300"></canvas></body></html>';

jsdom.env( html, function ( errors, window ) {
  if( errors ) console.log( errors );

  var $ = JQuery( window );   
  JCanvas( $, window );  


  var $c  = $( '<canvas>' );

  // hack required by width/height bug in jsdom/node-canvas integration
  $c[0].width = 400;
  $c[0].height = 300;

  // Standard jCanvas
  $c.scaleCanvas({
    scale: 0.25
  });// Create and draw a rectangle layer

  $c.addLayer({
  type: 'image',
  source: 'images/backgrounds/background-2.jpg',
  x: 50, y: 50,
  width: 80,
  height: 100,
  fromCenter: false
})
.drawLayers();
    //console.log($c.getLayer(0));

  console.warn( 'Paste the following as a url in your browser.' );
  console.log(  $c.getCanvasImage( 'png' ) );
  

});