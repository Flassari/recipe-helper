// Extends EventEmitter
const EventEmitter = require('events');
module.exports = new EventEmitter();

var isInitializing = false;
var isInitialized = false;
var isPickerPending = false;

var picker = null;

var pendingData;

function initialize()
{
	if (isInitializing || isInitialized) return;

	isInitializing = true;
	gapi.load('picker', {'callback': onApiLoaded});
}

function onApiLoaded()
{
	isInitialized = true;
	isInitializing = false;
	if (isPickerPending)
	{
		isPickerPending = false;
		pick(pendingData.oauthToken, pendingData.developerKey);
	}
}

function pick(oauthToken, developerKey)
{
	if (!isInitialized)
	{
		pendingData = { oauthToken: oauthToken, developerKey: developerKey};
		pendingOauthToken = oauthToken;
		pendingDeveloperKey = developerKey;
		isPickerPending = true;
		if (!isInitializing)
		{
			initialize();
		}
		return;
	}

	if (picker === null)
	{
		console.log("Dev key: " + developerKey);

		picker = new google.picker.PickerBuilder().
			addView(google.picker.ViewId.DOCUMENTS).
			setOAuthToken(oauthToken).
			setDeveloperKey(developerKey).
			setCallback(pickerCallback).
			build();
	}

	picker.setVisible(true);
}

function pickerCallback(data)
{
	if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
	{
		var doc = data[google.picker.Response.DOCUMENTS][0];
		var fileId = doc[google.picker.Document.ID];

		module.exports.emit('done', fileId);
	}
}

module.exports.initialize = initialize;
module.exports.pick = pick;