
/**
 * Module dependencies.
 */



var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

var _sockets = []
io.sockets.on('connection', function (socket) {
  socket.emit('news', 'world' );
  socket.on('my other event', function (data) {
    console.log(data);
  });
  _sockets.push(socket)
  /*setTimeout(function() {*/
  /*socket.emit('news', { hi: 'mum' });*/
  /*},1000);*/
});

var sys = require('sys');
var fs = require('fs');
var spawn = require('child_process').spawn;
var log=''
var filename = "/home/tha/log"
  /*var tail = process.createChildProcess("tail", ["-f", filename]);*/
var tail = spawn("tail", ["-f", filename]);
sys.puts("start tailing");

tail.stdout.on('data', function (d) {
  sys.puts(d);
  log += d;
  _sockets.forEach(function(e){ 
    console.log(e);
    e.emit('news', log);
  });
  log = '';

});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
