'use strict';
const electron = require('electron');
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const	BrowserWindow = electron.BrowserWindow;
const pty = require('pty.js');
const net = require('net');

// Require the child_process module so we can communicate with the user's terminal
const exec = require('child_process').exec;

var mainWindow = null;
// What does it mean for a JS object to be garbage collected?

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL('file://' + __dirname + '/index.html');

var currDir;
	var ptyTerm = pty.spawn('bash', [], {
		name: 'xterm-color',
		cols: 80,
		rows: 50,
		cwd: process.env.HOME,
		env: process.env
	});

//
	mainWindow.webContents.on('did-finish-load', function() {
	mainWindow.webContents.send('term-start-data', process.env.HOME + ' $ ');
	mainWindow.webContents.send('curr-dir', process.env.HOME);
});

	// sets the terminal prompt to pwd
	ptyTerm.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`)
	ipcMain.on('command-message', function(event, arg) {
		ptyTerm.write(arg);
		ptyTerm.removeAllListeners('data');
		ptyTerm.on('data', function(data) {
			event.sender.send('terminal-reply', data);
			//crude way to find path, need to improve
			var re = /\s[$]\s/g;
			if (data.match(re)) {
				var temp = data;
				temp = temp.replace(re,'');
				currDir = temp;
				event.sender.send('curr-dir', currDir);
				animationDataSchema(event,currDir)
			}
		});
	});

// child process that gets all items in a directory
function animationDataSchema(event,pwd){
	var command = 'cd ' + pwd + ';ls';
	exec(command, function(err, stdout, stderr) {
			if (err) {
				console.log(err.toString());
			} else {
				var stdoutArr = stdout.split('\n');
				var current = currDir.replace(/(.*[\\\/])/,'')
				var schema = schemaMaker(stdoutArr,current);
				event.sender.send('direc-schema', schema);
			}
	});
}

// makes schema of new directory
function schemaMaker(termOutput, directoryName){
	var schema = {
		"name": directoryName,
		"children": []
	};
	termOutput.forEach((i) => {
		if (!!i) schema.children.push({"name":i})
	})
	schema = [schema]
	return schema;
}

// For running tests to see whether the user is ready to advance
	// Listen for commands from the lesson file.
	ipcMain.on('command-to-run', function(event, arg) {
		// Upon receiving a command, run it in the terminal.

		exec(arg, function(err, stdout, stderr) {
			// Send the terminal's response back to the lesson.
				// For testing only
				console.log('command executed:', arg);
				if (err) {
					console.log(err.toString()); // This will give me the human-readable text description of the error from the Error object.
				} else {
					console.log('terminal output:', stdout);
				}
			if (err) return event.sender.send('terminal-output', err.toString()); // Should I send something else? Would stdout ever begin with the word 'Error'?
				// For testing only
				// exec('pwd', function(err, stdout, stderr) {
				// 	console.log('working directory at end:', stdout);
				// });
			event.sender.send('terminal-output', stdout);
		});
	});

	// Listen for a Boolean from the lesson file.
	// Is there a way to cut out the middleman here and send the test result directly from the lesson to Dashboard.js (rather than from the lesson to main.js and then from main.js to Dashboard.js)? I tried adding 'ipcRenderer.on('test-result-1'...)' to Dashboard.js, but that didn't work.
	ipcMain.on('test-result-1', function(event, arg) {
		// Upon receiving it, send it to the Dashboard.
		event.sender.send('test-result-2', arg);
	});

	// For testing only
	mainWindow.webContents.openDevTools();

	// Set mainWindow back to null when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
