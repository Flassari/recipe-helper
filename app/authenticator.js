var Promise = require('bluebird');
var apiLoaded = false;

function loadApi()
{
	return new Promise(function(resolve, reject)
	{
		if (apiLoaded)
		{
			resolve();
		}
		else
		{
			gapi.load('auth', {'callback': function() {
				apiLoaded = true;
				resolve();
			}});
		}
	});
}

module.exports.authenticate = function(clientId, scope)
{
	return loadApi().then(function()
	{
		return new Promise(function(resolve, reject)
		{
			gapi.auth.authorize({'client_id': clientId, 'scope': scope, 'immediate': false}, resolve);
		});
	});
}