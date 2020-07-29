var net = require('net');
var fs = require('fs');

var timeLog;
var logData = "";

function nowTime() {
  var now = new Date();
  var month = "";
  var year = "";
  var time = "";
  var day = "";
  month = now.getMonth() + 1;
  if (month < 10) month = "0" + (month);
  day = now.getDate();
  if (day < 10) day = "0" + day;
  year = "" + now.getFullYear();
  year = year.substring(2, 4);
  time = day + "." + month + "." + year;
  return(time);
}

function portConnect() {
  var socket = new net.Socket();
  socket.connect(23, '192.168.1.111', function() {
    console.log("Попытка подключения " + new Date());
  });

  socket.setTimeout(120000);
  socket.on('data', function(data) {
    setTimeout(function() {
	  var newTime = nowTime();
	  logData = data.toString();
	  console.log(logData);
      if (timeLog != newTime) {
        logData = "";
        timeLog = newTime;
        console.log("Дата изменилась на " + timeLog);
      }
	    fs.appendFileSync("/home/aster/nodescript/atslog/atslog/" + timeLog, logData, "utf8");
    }, 100);
  });

  socket.on('timeout', function() {
    console.log("socket timeout " + new Date());
    socket.destroy();
    //portConnect();
    setTimeout(function() {
      portConnect()
    }, 2000)
  });

  socket.on('error', function(ex) {
    console.log("Ошибка подключения " + new Date());
    console.log(ex);
    socket.destroy();
    setTimeout(function() {
      portConnect()
    }, 5000);
  });

  socket.on('end', function() {
    console.log('client disconnected');
  });

  socket.on('close', function() {
    console.log('client disconnected');
      //portConnect()
      //socket.end();
    //return(console.log("Soket close"));
  });

  return;
}

portConnect();