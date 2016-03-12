import Promise from 'bluebird';

let apiLoaded = false;

export function loadApi()
{
	return new Promise((resolve, reject) =>
	{
		if (apiLoaded)
		{
			resolve();
		}
		else
		{
			gapi.client.load('drive', 'v2', () => {
				apiLoaded = true;
				resolve();
			});
		}
	});
}

export function download(fileId, accessToken)
{
	return loadApi()
	.then(() => { return downloadFileInfo(fileId, accessToken) })
	.then((fileInfo) => {
		return $.ajax({ url: fileInfo.exportLinks['text/html'], headers: {'Authorization': 'Bearer ' + accessToken}});
	});
}

function downloadFileInfo(fileId, accessToken)
{
	return new Promise((resolve, reject) => {
		let request = gapi.client.drive.files.get({ 'fileId': fileId });
		request.execute(resolve);
	});
}
