var Promise = require('bluebird');

var apiLoaded = false;
var picker = null;

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
			gapi.load('picker', {'callback': function() {
				apiLoaded = true;
				resolve();
			}});
		}
	});
}

module.exports.pick = function pick(oauthToken, developerKey)
{
	return loadApi()
	.then(function() { createPicker(oauthToken, developerKey)})
	.then(function()
	{
		return new Promise(function(resolve, reject)
		{
			picker.setVisible(true);
			picker.setCallback(function(data)
			{
				if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
				{
					var doc = data[google.picker.Response.DOCUMENTS][0];
					var fileId = doc[google.picker.Document.ID];
					resolve(fileId);
				}
			});
		});
	});
}

function createPicker(oauthToken, developerKey) {
	if (picker) return null;

	picker = new google.picker.PickerBuilder()
		.addView(google.picker.ViewId.DOCUMENTS)
		.setOAuthToken(oauthToken)
		.setDeveloperKey(developerKey)
		.build();

	return null;
}