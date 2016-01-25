var Promise = require('bluebird');
var wurl = require('wurl');

module.exports.logIn = function(clientId, tokenExchangerUrl)
{
	if (localStorage.wunderlistAccessToken)
	{
		return Promise.resolve(localStorage.wunderlistAccessToken);
	}

	var code = wurl('?code');
	if (code) // User just returned from wunderlist auth page.
	{
		return getAuthToken(code, tokenExchangerUrl)
	}

	// Not logged in and not redirected from oauth page, redirect to log in page.
	var path = 'https://www.wunderlist.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.href  + '&state=' + Math.random().toString(36);
	window.location.href = path;
	return null;
}

function getAuthToken(code)
{
	return $.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).done(function() {
		localStorage.wunderlistAccessToken = response.access_token;
		return localStorage.wunderlistAccessToken;
	});
}

module.exports.getLists = function(clientId)
{
	return module.exports.logIn()
	.then(function(accessToken) {
		return $.ajax({
			url: 'https://a.wunderlist.com/api/v1/lists',
			type : 'GET',
			headers: {
				'X-Client-ID': clientId,
				'X-Access-Token': accessToken
			}
		});
	});
}

module.exports.addItems = function(ingredients)
{

}

