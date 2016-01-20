// Extends EventEmitter
const EventEmitter = require('events');
module.exports = new EventEmitter();

var isInitializing = false;
var isInitialized = false;
var isDownloadPending = false;

var authAccessToken;

var pendingData;

function initialize()
{
	if (isInitializing || isInitialized) return;

	isInitializing = true;
    gapi.client.load('drive', 'v2', onApiLoaded);
}

function onApiLoaded()
{
	isInitialized = true;
	isInitializing = false;
	if (isDownloadPending)
	{
		isDownloadPending = false;
		download(pendingData.fileId, pendingData.accessToken);
	}
}

function download(fileId, accessToken)
{
	authAccessToken = accessToken;

	if (!isInitialized)
	{
		pendingData = { fileId: fileId, accessToken: accessToken };
		isDownloadPending = true;
		if (!isInitializing)
		{
			initialize();
		}
		return;
	}
	
	var request = gapi.client.drive.files.get({ 'fileId': fileId });
	request.execute(onFileInfoDownloaded);
}

function onFileInfoDownloaded(resp)
{
	var htmlExportUrl = resp.exportLinks['text/html'];
	//var accessToken = gapi.auth.getToken().access_token;

	$.ajax({
		url: htmlExportUrl,
		headers: {'Authorization': 'Bearer ' + authAccessToken},
		success: onHtmlFileDownloaded
	});
}

function onHtmlFileDownloaded(htmlContent)
{
	module.exports.emit('done', htmlContent);
}

module.exports.initialize = initialize;
module.exports.download = download;