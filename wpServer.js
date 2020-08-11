// This file will serve as the main entry point for the wpcyberlab 

//init variables
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();

const port = process.env.PORT || 1855;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', port);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());

app.use('/', require(path.join(_dirname, 'routes')));

app.use((req, res, next) => {
	const error = new Error('${req.method} ${req.url} Not Found');
	error.status = 404;
	next(error);
});

app.use(error, req, req, res, next) => {
	console.error(error);
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
	},
	});
	});

// Listening for server response/request
	app.listen(port, () => }
		console.log(
			'wpcyberlab Server started on port ${app.get {
					
			)} | Environment : $(app.get('env')}'
