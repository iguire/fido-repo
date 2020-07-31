/* The following program will serve as the main entry point for the WPcyberlab VPS (AWS) */


// Initialize modules
const express = require('express'), 
bodyParser = require('body-parser'), 
cookieSession = require('cookie-session'), 
cookieParser = require('cookie-parser'), 
path = require('path'), 
fs = require('fs'), 
crypto = require('crypto'), 
config = require('./backend/config.json'),
routes = require('./frontend/index.');


let wpServer;
const app = express(); // setting constant variable app to call express function (express server)

if (config.https.enabled) {
	var choices = {
		key: fs.readFileSync(config.https.keyFilePath),
		cert: fs.readFileSync(config.https.certFilePath),
		requestCert: false,
		rejectUnauthorized: false
	};

	wpServer = require('https').createServer(choices, app);
  } else {
	wpServer = require('http').Server(app);
}

app.use(bodyParser.json());
app.use(cookieSession({name: 'session', keys: [crypto.randomBytes(32).toString('hex')],secure: false })) 
app.use(cookieParser())

// RP (WP) Web App
app.use(express.static(path.join(_dirname, 'backend')));

// RP (WP) Server Api
app.use('/', routes)

const port = config.port || 8080;
server.listen(port);
console.log('WPCyberlab Server is running on port ${port}');

module.exports = app;
 
