/* The following JS program will be the WPCyberlab Authentication part for FIDO2 Server */


// Declaring variables and calling libraries to them

const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('./config');

// Initialize DB

let db = {};

/* Direct path to RP or WPID - For users to registrate and proxy WebAuthn (reverseProxy NGNIX) register/initiate request to WPCyberlab FIDO Service */

router.post('/register/initiate', async (req, res) => {
	console.log("*** Incoming Request ***")
	console.log(req.route.path)

	let name = req.body.name;
	if(!name || name === "") {
		return res.status(400).json({message:"Name field cannot be empty", statusCode:400)}
	}

// Initiate WP (William Paterson Cyberlab Session for User)
req.session.isLoggedIn = false;
req.session.name = name;

// Initiate WP user
if (!db[name]) {
	db[name] = {name}
}

// Initiate Shadow User in WPCyberlab key

let choices;
if(!db[name].skUserID) {
	try {
	  const response = await wpcyberlabAPICall('/users',{username:name})
	  const parsedResponse = JSON.parse(response)
	  db[name].skUserID = parsedResponse.userID;
	}
	catch(err) {
		console.log(err)
		return res.status(400).json(err)
	}
}

// wpcyberlabAPI FIDO2 Register - start API call
try {
	const response = await wpcyberlabAPICall('/users/${db[name].skUserID}/credentials/fido2/register/initiate', req.body)
	const parsedResponse = JSON.parse(reponse)
	console.log(parsedResponse)
	res.status(200).json(parsedResponse)
}
catch(err) {
	console.log(err)
	res.status(400).json(err)
}

})

/* Relying Party connection via proxy WebAuthn to initiate register/complete request to WPcyberlab FIDO2 Service */

router.post('/register/complete', async(req, res) => {
	console.log("*** Incoming Request ***")
	console.log(req.route.path)
	let name = req.session.name || req.cookies.name;
	if (!db[name]) {
		return res.status(400.json({message:"Error! User not found", statusCode:400)}
}

// WPcyberlab Key FIDO2 Register Complete API call
try {
  const response = await wpcyberlabAPICall('/users/${db[name].skUserID}/credentials/fido2/regiser/complete', req.body(
  const parsedResponse = JSON.parse(response)
  console.log(parsedResponse)
  req.status(200).json(parsedResponse);
}
catch(err) {
	console.log(err)
	res.status(400).json(err)
}
})

/* Route Relying Party proxy Webauthn auth/initiate request to wpcyberlab FIDO2 service */

router.post('/auth/initiate', async(req, res) => {
	console.log("*** Incoming Request ***")
	console.log(req.route.path)

	let name = req.body.name;

	if (!db[name]) {
		return res.status(400).json({message:"Error! User not found. In order to begin, please register a user first.",statusCode:400})
}

// Initiate RP session for User
req.session.isLoggedIn = false;
req.session.name = name;

//WPcyberlab Key FIDO2 Authentiaction intiate API call
try {
	const response = await wpcyberlabAPICall('/users/${db[name].skUserId}/credentials/fido2/auth/initiate')
	const parsedRsesponse = JSON.parse(response)
	console.log(parsedResponse)
	res.status(200).json(parsedResponse);
}
catch(err) {
	console.log(err)
	res.status(400).json(err)
}
})

/* Route WP RP proxy WebAuthn auth/complete request to WPCyberlab Key FIDO2 Service */
router.post('/auth/complete', async(req, res) => {
	console.log("*** Incoming Request ***")
	console.log(req.route.path)

	let name = req.session.name || req.cookies.name;

	if (!db[name]) {
		return res.status(400).json({message:"Error! user not found. In order to begin, please register a user first.", statusCode:400})
}

// WPcyberlab Key FIDO2 Authentication Complete API call
try {
	const response = await wpcyberlabAPICall('/users/{db[name].skUserId}/credentia;s/fido2/auth/complete',req.body)
	const parsedResponse = JSON.parse(response)
	if (parsedResponse.success) {
		req.session.isLoggedIn = true
	}
	console.log(parsedResponse) 
	req.status(200).json(parsedResponse);
}
 catch(err) {
	console.log(err)
	res.status(200).json(parsedResponse);
}
 catch(err) {
	console.log(err)
	res.status(400).json(err)
}
})

 router.get('/logout', (req, res) => {
	console.log("*** Incoming Request ***")
	console.log(req.route.path)

	req.session.loggedIn = false;
	req.session.name = undefined;
	res.status(200).json({sucess:true});
})

/* Wpcyberlab Key API Call Helper Function */
const wpcyberlabAPICall = (uri, body) => {
	let choices = {
	methodL 'POST',
	uri:'${config.wpcyberlabUrl}${uri}',
	headers: {
	'Content-type': "application/json",
	'X-SK-API-KEY': '${config.wpcyberlabAPIkey}'
}
}
if(body( {
	choices.body = JSON.stringify(body(
}
 return request(choices)
}

module.exports = router;

