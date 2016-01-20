// Extends EventEmitter
const EventEmitter = require('events');
module.exports = new EventEmitter();

var isInitializing = false;
var isInitialized = false;
var isAuthenticationPending = false;

var pendingData;

function initialize()
{
	if (isInitializing || isInitialized) return;

	isInitializing = true;
	gapi.load('auth', {'callback': onApiLoaded});
}

function onApiLoaded()
{
	isInitialized = true;
	isInitializing = false;
	if (isAuthenticationPending)
	{
		isAuthenticationPending = false;
		authenticate(pendingData.clientId, pendingData.scope);
	}
}

function authenticate(clientId, scope)
{
	if (!isInitialized)
	{
		pendingData = { clientId: clientId, scope: scope };
		isAuthenticationPending = true;
		if (!isInitializing)
		{
			initialize();
		}
		return;
	}
	
	gapi.auth.authorize({'client_id': clientId, 'scope': scope, 'immediate': false}, handleAuthResult);
}

function handleAuthResult(authResult)
{
	module.exports.emit('done', authResult);
}

module.exports.initialize = initialize;
module.exports.authenticate = authenticate;