// Extends EventEmitter
var EventEmitter = require('events');
module.exports = new EventEmitter();

var Promise = require('bluebird');

var wurl = require('wurl');

var clientId;
var tokenExchangerUrl;

module.exports.logIn = function(_clientId, _tokenExchangerUrl)
{
	return new Promise(function(resolve, reject)
	{
		if (localStorage.wunderlistAccessToken)
		{
			resolve();
			return;
		}

		clientId = _clientId;
		tokenExchangerUrl = _tokenExchangerUrl;

		var code = wurl('?code');
		if (code) // User just returned from wunderlist auth page.
		{
			getAuthToken(code).done(resolve);
			return;
		}

		// Not logged in and not redirected from oauth page, redirect to log in page.
		var path = 'https://www.wunderlist.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.href  + '&state=' + Math.random().toString(36);
		window.location.href = path;
	});
}

module.exports.getLists = function()
{
	return $.ajax({
		url: 'https://a.wunderlist.com/api/v1/lists',
		type : 'GET',
		headers: {
			'X-Client-ID': clientId,
			'X-Access-Token': localStorage.wunderlistAccessToken
		},
		data: 'code=' + code
	});
}

module.exports.addItems = function(ingredients)
{

}

function getAuthToken(code)
{
	return $.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).done(authTokenDone);
}

function authTokenDone(response)
{
	localStorage.wunderlistAccessToken = response.access_token;
}