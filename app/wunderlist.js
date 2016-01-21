// Extends EventEmitter
const EventEmitter = require('events');
module.exports = new EventEmitter();

var wurl = require('wurl');

var isLoggingIn = false;

var clientId;
var tokenExchangerUrl;

module.exports.logIn = function(_clientId, _tokenExchangerUrl)
{
	if (localStorage.wunderlistAccessToken)
	{
		loggedIn();
		return;
	}

	clientId = _clientId;
	tokenExchangerUrl = _tokenExchangerUrl;

	var code = wurl('?code');
	if (code) // User just returned from wunderlist auth page.
	{
		getAuthToken(code);
		return;
	}

	// Not logged in and not redirected from oauth page, redirect to log in page.
	var path = 'https://www.wunderlist.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.href  + '&state=' + Math.random().toString(36);
	window.location.href = path;
}

function loggedIn()
{
	module.exports.emit('loggedIn');
}

function getAuthToken(code)
{
	console.log('requesting auth token');
	$.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).done(authTokenDone);
}

function authTokenDone(response)
{
	console.log("response!");
	console.log(response);

	localStorage.wunderlistAccessToken = response.access_token;
	loggedIn();
}