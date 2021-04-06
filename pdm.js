let app = new PIXI.Application({width: 920, height: 1150, antialias: true});

const wetplate = document.querySelector('#wetplate');
wetplate.appendChild(app.view);

const paralaxarea = document.querySelector('#wetplate canvas');


var newMultiplexer;
var multiplexer = 30;
var mediaSize = "size: ???";

//DISPLACE
//var displacefactor = 20;
var maxDisplace = 18;
var orientIndicatorFactor = 4;  
  
const permissionBtn = document.querySelector('#permission');

var accelX;
var accelY;
var accelZ;
var accelGravX;
var accelGravY;
var accelGravZ;
var rotRateAlpha;
var rotRateBeta;
var rotRateGamma;
var orientR;
var orientX;
var orientY;
var deltaR;
var deltaY;
var deltaX;

var resetInitialOrientation = 0;
var initR;
var initX;
var initY;
var orientationTest = 'false';

var xpos;
var ypos;
var rect;
var regx;
var regy;
var rect = {};

var showTelemetry = true;
var USER_IS_TOUCHING = false;

var clientXdelta = 0;
var clientYdelta = 0;
var i = 0;
var j = 0;

var prevXpos;
var prevYpos;
var cursorXdelta;
var cursorYdelta;
var distToRegX;
var distToRegY;

























let background = new PIXI.Sprite.from("https://static1.squarespace.com/static/5aac041c9f8770c50060dca8/t/6066c071ba16b241de16e34c/1617346691057/cutout-backgorund.png");
background.width = 920;
background.height = 1150;
background.anchor.set(0);
app.stage.addChild(background);

let img = new PIXI.Sprite.from("https://static1.squarespace.com/static/5aac041c9f8770c50060dca8/t/6066c032c449387c0223b77c/1617346621446/subject.png");
//let img = new PIXI.Sprite.from("https://static1.squarespace.com/static/5aac041c9f8770c50060dca8/t/6066c045c894556d34c57bda/1617346636806/depth-mask.png");
img.width = 920;
img.height = 1150;
img.anchor.set(0);
app.stage.addChild(img);

depthMap = new PIXI.Sprite.from("https://static1.squarespace.com/static/5aac041c9f8770c50060dca8/t/6066c045c894556d34c57bda/1617346636806/depth-mask.png");
depthMap.width = 920;
depthMap.height = 1150;
depthMap.anchor.set(0);
app.stage.addChild(depthMap);

displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
displacementFilter.scale.x = 0;
displacementFilter.scale.y = 0;

img.filters = [displacementFilter];

let frame = new PIXI.Sprite.from("https://static1.squarespace.com/static/5aac041c9f8770c50060dca8/t/6066c090c894556d34c57cb0/1617346711628/cutout-frame.png");
frame.width = 920;
frame.height = 1150;
frame.anchor.set(0);
app.stage.addChild(frame);

// BEGIN SECTION // FOR TESTING PURPOSES -- REMOVE WIN FINISHED 
const dispPointer = new PIXI.Graphics();
dispPointer.lineStyle(2, 0xFF0000, .5);
dispPointer.beginFill(0xFF0000, .25);
dispPointer.drawStar(img.width/2, img.height/2, 5, 5);
dispPointer.endFill();
app.stage.addChild(dispPointer);

const graphics = new PIXI.Graphics();
graphics.lineStyle(2, 0x00FFFF, .5);
graphics.beginFill(0x00FFFF, .25);
graphics.drawStar(img.width/2, img.height/2, 5, 3);
graphics.endFill();
app.stage.addChild(graphics);

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    fill: 0xFFFFFF, // gradient
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
    align:'left',
});

const displacementText = new PIXI.Text('displacement: (0,0)', style);
displacementText.x = img.x +10;
displacementText.y = 5;
app.stage.addChild(displacementText);

const pointerText = new PIXI.Text('pointer: (0,0)', style);
pointerText.x = img.x +10;
pointerText.y = 25;
app.stage.addChild(pointerText);

const canvasText = new PIXI.Text('canvas: (0,0)', style);
canvasText.x = img.x +10;
canvasText.y = 45;
app.stage.addChild(canvasText);

const sizeText = new PIXI.Text('size: ???', style);
sizeText.x = img.x +10;
sizeText.y = 65;
app.stage.addChild(sizeText);

const touchText = new PIXI.Text('touch: FALSE', style);
touchText.x = img.x +10;
touchText.y = 85;
app.stage.addChild(touchText);

const newMultiplexerXText = new PIXI.Text('newMultiplexerX: XX', style);
newMultiplexerXText.x = img.x +200;
newMultiplexerXText.y = 5;
app.stage.addChild(newMultiplexerXText);

const newMultiplexerYText = new PIXI.Text('newMultiplexerY: XX', style);
newMultiplexerYText.x = img.x +200;
newMultiplexerYText.y = 25;
app.stage.addChild(newMultiplexerYText);



//Device Orientation
const orientxText = new PIXI.Text('orient X: ', style);
orientxText.x = img.x +10;
orientxText.y = 115;
app.stage.addChild(orientxText);

const orientyText = new PIXI.Text('orient Y: ', style);
orientyText.x = img.x +10;
orientyText.y = 135;
app.stage.addChild(orientyText);

const orientrotText = new PIXI.Text('orient R: ', style);
orientrotText.x = img.x +10;
orientrotText.y = 155;
app.stage.addChild(orientrotText);

//Device Orientation Delta
const deltaxText = new PIXI.Text('delta X: XXX.XX', style);
deltaxText.x = img.x +200;
deltaxText.y = 115;
app.stage.addChild(deltaxText);

const deltayText = new PIXI.Text('delta Y: XXX.XX', style);
deltayText.x = img.x +200;
deltayText.y = 135;
app.stage.addChild(deltayText);

const deltarText = new PIXI.Text('delta R: XXX.XX', style);
deltarText.x = img.x +200;
deltarText.y = 155;
app.stage.addChild(deltarText);

//Device Orientation Initial
const initxText = new PIXI.Text('init X: XXX.XX', style);
initxText.x = img.x +400;
initxText.y = 115;
app.stage.addChild(initxText);

const inityText = new PIXI.Text('init Y: XXX.XX', style);
inityText.x = img.x +400;
inityText.y = 135;
app.stage.addChild(inityText);

const initrText = new PIXI.Text('init R: XXX.XX', style);
initrText.x = img.x +400;
initrText.y = 155;
app.stage.addChild(initrText);

//Device Motion
const accelxText = new PIXI.Text('accel X: ', style);
accelxText.x = img.x +10;
accelxText.y = 185;
app.stage.addChild(accelxText);

const accelyText = new PIXI.Text('accel Y: ', style);
accelyText.x = img.x +10;
accelyText.y = 205;
app.stage.addChild(accelyText);

const accelzText = new PIXI.Text('accel Z: ', style);
accelzText.x = img.x +10;
accelzText.y = 225;
app.stage.addChild(accelzText);

const accelGravxText = new PIXI.Text('accelGrav X: ', style);
accelGravxText.x = img.x +10;
accelGravxText.y = 255;
app.stage.addChild(accelGravxText);

const accelGravyText = new PIXI.Text('accelGrav Y: ', style);
accelGravyText.x = img.x +10;
accelGravyText.y = 275;
app.stage.addChild(accelGravyText);

const accelGravzText = new PIXI.Text('accelGrav Z: ', style);
accelGravzText.x = img.x +10;
accelGravzText.y = 295;
app.stage.addChild(accelGravzText);

const rotRateAlphaText = new PIXI.Text('rotRate Alpha: ', style);
rotRateAlphaText.x = img.x +10;
rotRateAlphaText.y = 325;
app.stage.addChild(rotRateAlphaText);

const rotRateBetaText = new PIXI.Text('rotRate Beta: ', style);
rotRateBetaText.x = img.x +10;
rotRateBetaText.y = 345;
app.stage.addChild(rotRateBetaText);

const rotRateGammaText = new PIXI.Text('rotRate Gamma: ', style);
rotRateGammaText.x = img.x +10;
rotRateGammaText.y = 365;
app.stage.addChild(rotRateGammaText);

const screenOrientText = new PIXI.Text('screen: XXX', style);
screenOrientText.x = img.x +10;
screenOrientText.y = 395;
app.stage.addChild(screenOrientText);

var maxBoundLength = maxDisplace * orientIndicatorFactor * 2;

const maxBound = new PIXI.Graphics();
maxBound.x = (img.width / 2) - (maxBoundLength*1.5);
maxBound.y = (img.height / 2) - (maxBoundLength*1.5);
//maxBound.anchor.x = 0.5;
//maxBound.anchor.y = 0.5;
//maxBound.beginFill(0xFFFFFF);
maxBound.lineStyle(2, 0xFF0000, .5);
maxBound.drawRect(maxBoundLength, maxBoundLength, maxBoundLength, maxBoundLength);
maxBound.endFill();
app.stage.addChild(maxBound);

// END SECTION // FOR TESTING PURPOSES -- REMOVE WIN FINISHED 

//let count = 0;
app.ticker.add(() => {
  // let's rotate the aliens a little bit
  //for (let i = 0; i < 100; i++) {
  //    const alien = aliens[i];
  //    maxBound.rotation += 0.1;
  //}

  //count += 0.01;

  //maxBound.scale.x = Math.sin(count);
  //maxBound.scale.y = Math.sin(count);
  //maxBound.rotation += 0.01;
});

//app.stage.interactive = false;

///////////////////////////////////////////////////////////////////////////// EVENT LISTENERS ////////////////////////////////////////////////////////////////

window.addEventListener('pointermove', displaceByMouse);
permissionBtn.addEventListener('pointerup', requestDevicePermission);

/*screen.orientation.addEventListener('change', function() {console.log('new scren orientation is ', screen.orientation.type);});
window.orientation.addEventListener('change-window', function() {console.log('new WINDOW orientation is: ', window.orientation);});*/

/*window.addEventListener('touchstart', function onFirstTouch(){USER_IS_TOUCHING = true; console.log('this is a touch screen enabled device');});*/
/*paralaxarea.onpointerleave = function(e) {gsap.to(displacementFilter.scale, {x: 0, y: 0, duration: 1, repeat: 0, yoyo: false, delay: .5,});}*/

//////////////////////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////






function requestDevicePermission(e) {

  console.log('test for device motion!');
  DeviceMotionEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        console.log('=== MOT SUCCESS === device motion granted!');
        maxDisplace = 40;
        window.addEventListener('devicemotion', (e) => {
          motionListener(e);          
        })
      } else {
        deviceMotionEnabled = false;
      }
    })
  .catch(console.error)

  console.log('device orientation!');
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        console.log('=== ORI SUCCESS === device orientation granted!');
        window.addEventListener('deviceorientation', (e) => {
          orientationListener(e);
        })
        window.removeEventListener('pointermove', displaceByMouse);
      } else {
        deviceMotionEnabled = false;
      }
    })
  .catch(console.error) 
  
  if(deviceMotionEnabled = false){
    window.addEventListener('pointermove', displaceByMouse);
  }
}






function displaceByMouse(e) {
  //const target = e.target;
  rect = paralaxarea.getBoundingClientRect();
  //rect = window.innerWidth;
  
  prevXpos = xpos;
  prevYpos = ypos;
  
  //position of pointer within the canvas
  xpos = e.clientX;
  ypos = e.clientY;
  
  regx = rect.width / 2 + rect.left;
  regy = rect.height / 2 + rect.top;

  //if(USER_IS_TOUCHING == true){multiplexer = .5;}

  if(rect.width < 420) {
    multiplexer = 20;
    mediaSize = "size: small " + multiplexer;
  } else if (rect.width > 420 && rect.width < 800){
    multiplexer = 30;
    mediaSize = "size: medium " + multiplexer;
  } else {
    multiplexer = 20;
    mediaSize = "size: large " + multiplexer;
  }

  
  distToRegX = Math.abs(regx - xpos)/(document.documentElement.clientWidth/2);
  distToRegY = Math.abs(regy - ypos)/(document.documentElement.clientHeight/2);

  newMultiplexerX = 2 - Math.round(distToRegX*10)/10;
  newMultiplexerY = 2 - Math.round(distToRegY*10)/10;

  //var prevDistToRegX = Math.abs(regx - prevXpos)/(document.documentElement.clientWidth/2);
  //var prevDdistToRegY = Math.abs(regy - prevYpos)/(document.documentElement.clientHeight/2);
    
  //cursorXdelta = Math.sign(prevDistToRegX + distToRegX);
  //cursorYdelta = Math.sign(prevDdistToRegY + distToRegY);

  //if(cursorXdelta != 0) {}// * cursorXdelta;} //x distance the pointer is from x registration as a percentage of the window
  //if(cursorYdelta != 0) {};// * cursorYdelta;} //y distance the pointer is from y registration as a percentage of the window

  displacementFilter.scale.x = (regx - xpos)/(multiplexer / (newMultiplexerX/3));
  displacementFilter.scale.y = (regy - ypos)/(multiplexer / (newMultiplexerY/3));

//console.log('newMultiplexer: (' + newMultiplexerX + ',' + newMultiplexerY + ')');
//console.log('newMultiplexer: (' + Math.round(displacementFilter.scale.x) + ',' + Math.round(displacementFilter.scale.y) + ')');

  checkMaxDisplacement(displacementFilter.scale);
  updateTelemetry();
}











function orientationListener(e) {
  orientR = e.alpha;
  orientX = e.gamma;
  orientY = e.beta;
  //orientAbs = e.absolute;
  multiplexer = 1;

  if (resetInitialOrientation == 0) { // Captures initial device orientation
    initR = e.alpha;
    initX = e.gamma;
    initY = e.beta;
    //console.log('initial ROT: ' + e.alpha + ' initial X: ' + e.gamma + ' initial Y: ' + e.beta);
    resetInitialOrientation = 1;
  }

  deltaR = orientR - 180;
  deltaX = (orientX)/2;
  deltaY = (orientY - 50)/3;
  
  distToRegX = Math.abs(orientX)/(90);
  distToRegY = Math.abs(orientY)/(180);

  newMultiplexerX = 2 - Math.round(distToRegX*10)/10;
  newMultiplexerY = 2 - Math.round(distToRegY*10)/10;
  
  displacementFilter.scale.x = deltaX/(multiplexer / (newMultiplexerX/3));
  displacementFilter.scale.y = deltaY/(multiplexer / (newMultiplexerY/3));

  checkMaxDisplacement(displacementFilter.scale);    
  updateTelemetry();
}


function motionListener(e) {
  accelX = e.acceleration.x;
  accelY = e.acceleration.y;
  accelZ = e.acceleration.z;
  accelGravX = e.accelerationIncludingGravity.x;
  accelGravX = e.accelerationIncludingGravity.y;
  accelGravZ = e.accelerationIncludingGravity.z;
  rotRateAlpha = e.rotationRate.alpha;
  rotRateBeta = e.rotationRate.beta;
  rotRateGamma = e.rotationRate.gamma;
  //interval = e.interval;

  //displacementFilter.scale.x = (Math.round(accel.x * 10)/10); //(regx - xpos)/(multiplexer * displacefactor);
  //displacementFilter.scale.y = (Math.round(accel.x * 10)/10); //(regy - ypos)/(multiplexer * displacefactor);
  
  //console.log('accelGrav X: ' + accelGrav.x * Math.sign(accelGrav.x));
  //console.log('accelGrav Y: ' + accelGrav.y * Math.sign(accelGrav.y));
  determineOrientation()
  updateTelemetry();
}




function updateTelemetry(e) {

  //TEXT
  orientrotText.text = 'orientR: ' + Math.round(orientR * 10)/10;
  orientxText.text = 'orientY: ' + Math.round(orientY * 10)/10;
  orientyText.text = 'orientX: ' + Math.round(orientX * 10)/10;

  deltarText.text = 'deltaR: ' + Math.round(deltaR * 10)/10;
  deltaxText.text = 'deltaY: ' + Math.round(deltaY * 10)/10;
  deltayText.text = 'deltaX: ' + Math.round(deltaX * 10)/10;

  initrText.text = 'initR: ' + Math.round(initR * 10)/10;
  initxText.text = 'initY: ' + Math.round(initY * 10)/10;
  inityText.text = 'initX: ' + Math.round(initX * 10)/10;


  accelxText.text = 'accelX: ' + Math.round(accelX * 10)/10; 
  accelyText.text = 'accelY: ' + Math.round(accelY * 10)/10;
  accelzText.text = 'accelZ: ' + Math.round(accelZ * 10)/10;
  
  accelGravxText.text = 'accelGrav X: ' + Math.round(accelGravX * 10)/10;
  accelGravyText.text = 'accelGrav Y: ' + Math.round(accelGravY * 10)/10;
  accelGravzText.text = 'accelGrav Z:' + Math.round(accelGravZ * 10)/10;
  
  rotRateAlphaText.text = 'rotRate alpha: ' + Math.round(rotRateAlpha * 10)/10;
  rotRateBetaText.text = 'rotRate beta: ' + Math.round(rotRateBeta * 10)/10;
  rotRateGammaText.text = 'rotRate gamma:' + Math.round(rotRateGamma * 10)/10;
  
  //intervalText.text = 'interval: ' + interval;

  //screenOrientText.text = 'screen: ' + orientationTest;
  displacementText.text = 'displacement: (' + Math.round(displacementFilter.scale.x) + ', ' + Math.round(displacementFilter.scale.y) + ')';

  displacementText.text = 'displacement: (' + Math.round(displacementFilter.scale.x) + ', ' + Math.round(displacementFilter.scale.y) + ')';
  pointerText.text = 'pointer: (' + Math.round(xpos) + ', ' + Math.round(ypos) + ')';
  canvasText.text = 'canvas: (' + Math.round(rect.width) + ', ' + Math.round(rect.height) + ')';
  touchText.text = 'touch: ' + USER_IS_TOUCHING;
  sizeText.text = mediaSize;

  newMultiplexerXText.text = 'newMultiplexerX: ' + newMultiplexerX;
  newMultiplexerYText.text = 'newMultiplexerY: ' + newMultiplexerY;

  //POINTERS
  dispPointer.x = orientIndicatorFactor * displacementFilter.scale.x; //Move red pointer x
  dispPointer.y = orientIndicatorFactor * displacementFilter.scale.y; //Mover red pointer y
}























function determineOrientation() {
  //use screen orientation API if possible...
  var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
  
  if (orientation === "landscape-primary") {
    console.log("That looks good.");
    screenOrientText.text = 'screen: ' + orientation;
  } else if (orientation === "landscape-secondary") {
    console.log("Mmmh... the screen is upside down!");
    screenOrientText.text = 'screen: ' + orientation;
  } else if (orientation === "portrait-secondary" || orientation === "portrait-primary") {
    console.log("Mmmh... you should rotate your device to landscape");
    screenOrientText.text = 'screen: ' + orientation;
  } else if (orientation === undefined) {
  
    
    console.log("The orientation API isn't supported in this browser :(");
    screenOrientText.text = 'screen: (window) ' + window.orientation;
  }

  //Determine device orientation
  if (accelGravX * Math.sign(accelGravX) > accelGravY * Math.sign(accelGravY)) { //
    if(Math.sign(accelGravX) == -1) {  //screen is in landscape and turned to the left
      orientationTest = 'landscape-primary';
      console.log('landscape-primary');
      return;
    } else if (Math.sign(accelGravX) == 1) {  //screen is in landscape and turned to the right 
      orientationTest = 'landscape-secondary';
      console.log('landscape-secondary');
      return;
    }
  }
    else {
    if(Math.sign(accelGravY) == -1) {  //screen is in portrait and facing up
      orientationTest = 'portrait-primary';
      console.log('portrait-primary');
      return;
    } else if(Math.sign(accelGravY) == 1) {  //screen is in portrait and turned upsidedown
      orientationTest = 'portrait-secondary';
      console.log('portrait-secondary');
      return;
    }
  }

  //Switch X & Y axis if in portrait
  //if(accelX + accelY + accelZ <= .0125) {
  //  resetInitialOrientation = 0;
  //  gsap.to(displacementFilter.scale, {x: 0, y: 0, duration: .125, repeat: 0, yoyo: false, delay: 0,});

    //console.log('resetting baseline orientation: ' + (accelX + accelY + accelZ));
  //}
}


function checkMaxDisplacement(e) {
  var xFlag;
  var yFlag;
  if(e.x > maxDisplace) {displacementFilter.scale.x = maxDisplace; i++; xFlag = 1} //Too far right
  if(e.x < -maxDisplace){displacementFilter.scale.x = -maxDisplace; i++; xFlag = -1} //too far left
  
  
  if(e.y > maxDisplace) {displacementFilter.scale.y = maxDisplace; i++; yFlag = 1} //Too far down
  if(e.y < -maxDisplace){displacementFilter.scale.y = -maxDisplace; i++; yFlag = -1} //too far top
  
  screenOrientText.text = 'displace Val (' + Math.round(e.x*10)/10 + ' , ' + Math.round(e.y*10)/10 + ')'
  console.log('displace val (' + Math.round(e.x*10)/10 + ' , ' + Math.round(e.y*10)/10 + ')');
  
  if(i<=2) {
    //clientXdelta = clientXdelta + (xFlag * multiplexer);
    i = 0;
  }
  if(j<=2) {
    //clientYdelta = clientYdelta + (yFlag * multiplexer);
    j = 0;
  }
}





