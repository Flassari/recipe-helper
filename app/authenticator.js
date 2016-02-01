var Promise = require('bluebird');
var apiLoaded = false;

module.exports.loadApi = function()
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
	// TODO: Reject if API not loaded.
	return new Promise(function(resolve, reject)
	{
		gapi.auth.authorize({'client_id': clientId, 'scope': scope, 'immediate': false}, resolve);
	});
}