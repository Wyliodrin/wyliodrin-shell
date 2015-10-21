
"use strict";

var express = require('express');
var app = express ();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var fs = require ('fs');
var md5 = require ('md5');
var pty = require ('pty.js');
var _ = require ('lodash');

/*var board = readFileSync ('/etc/wyliodrin/boardtype');
console.log ('Board is '+board);
var setup = JSON.parse (readFileSync ('/etc/wyliodrin/settings_'+board+'.json'));
console.log (setup);
var config = JSON.parse(readFileSync (setup.config_file));
console.log (config);*/

var board = 'raspberrypi';
var config = {
	password: 'qawsed'
};

console.log ('Password '+md5 (config.password));

var term = null;

app.use ('/public', express.static ('./public'));

app.get ('/shell/:password', function (req, res)
{
	if (req.params.password === md5(config.password))
	{
		res.send (200);
	}
	else
	{
		res.send (404);
	}
});

app.get ('/', function (req, res)
{
	res.redirect ('/public/index.html');
});

server.listen(process.env.PORT || 80);

io.on('connection', function (socket) {
	var login = false;
	var term = null;

	socket.on ('login', function (data)
	{
		console.log (md5(config.password));
		if (!login && data && data === md5(config.password))
		{
			login = true;

			term = pty.spawn('bash', [], {
			  name: 'xterm-color',
			  cols: data.width || 80,
			  rows: data.heigth || 25,
			  cwd: '/wyliodrin',
			  env: _.assign (process.env, {
			  	wyliodrin_board: board,
			  	HOME: '/wyliodrin'
			  })
			});

			term.on ('data', function (data)
			{
				socket.emit ('keys', data);
			});

			term.on ('exit', function ()
			{
				socket.write ('Shell closed');
				socket.disconnect ();
			});
		}
		else
		{
			socket.emit ('keys', 'Authentication error');
			socket.disconnect ();
		}
	});

	socket.on ('keys', function (data)
	{
		if (term)
		{
			term.write (data);
		}
		else
		{
			socket.emit ('keys', 'Authentication error');
			socket.disconnect ();
		}
	});

	socket.on ('size', function (data)
	{
		if (term)
		{
			term.resize (data.width, data.height);
		}
		else
		{
			socket.emit ('keys', 'Authentication error');
			socket.disconnect ();
		}
	});
  });

