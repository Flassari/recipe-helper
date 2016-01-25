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
			gapi.client.load('drive', 'v2', function() {
				apiLoaded = true;
				resolve();
			});
		}
	});
}

module.exports.download = function download(fileId, accessToken)
{
	return loadApi()
		.then(function() { return downloadFileInfo(fileId, accessToken) })
		.then(function(fileInfo) {
			return $.ajax({ url: fileInfo.exportLinks['text/html'], headers: {'Authorization': 'Bearer ' + accessToken}});
		});
}

function downloadFileInfo(fileId, accessToken)
{
	return new Promise(function (resolve, reject) {
		var request = gapi.client.drive.files.get({ 'fileId': fileId });
		request.execute(resolve);
	});
}