'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var clearButton = document.getElementsByClassName('clear-button')[0];
  var userDisplay = document.getElementsByClassName('user-display')[0];
  var userNumber = document.getElementsByClassName('user-number')[0];
  var context = canvas.getContext('2d');
  var colorList = {
    green: '#2A9D8F',
    yellow:'#E9C46A',
    orange:'#F4A261',
    red: '#E76F51',
    black: '#212121',
    white: '#FFFCFA',
    eraser: '#264653',
  };

  var current = {
    color: 'black'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, {passive: true});
  canvas.addEventListener('touchend', onMouseUp, {passive: true});
  canvas.addEventListener('touchcancel', onMouseUp, {passive: true});
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), {passive: true});

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  clearButton.addEventListener('click', onClearClick, false);


  // room
  socket.emit('room', {room: window.location.pathname.toLowerCase()});

  // listeners
  socket.on('drawing', onDrawingEvent);
  socket.on('clear', onClearEvent);
  socket.on('users', onUserEvent);
  socket.on('history', onHistoryEvent);
  socket.on('gethistory', onGetHistoryEvent);

  window.addEventListener('resize', debounce(function(e){onResize()}), false);
  onResize();


  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 10;
    context.lineCap = 'round';
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  function clearBoard(data, emit) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!emit) { return; }
    socket.emit('clear', {user: 'owen'});
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, colorList[current.color], true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, colorList[current.color], true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    for (var i = 0; i < colors.length; i++){
      colors[i].classList.remove("color-selected");
    }
    e.target.classList.add("color-selected");
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  function onClearEvent(data){
    clearBoard(data,false);
  }

  function onUserEvent(data){
    userNumber.innerHTML = data.userAmount;
  }

  function onGetHistoryEvent(data){
    setupDrawing(data.list);
  }

  function onHistoryEvent(data){
    setupDrawing(data.list);
  }

  function setupDrawing (list){
    var w = canvas.width;
    var h = canvas.height;
    list.forEach((data) => {
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    });
  }


  function onClearClick(){
    clearBoard({user: 'owen'},true);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //socket.emit('gethistory', {data: 'data'});
  }

  function debounce(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer);
      timer = setTimeout(func,100,event);
    };
  }

})();