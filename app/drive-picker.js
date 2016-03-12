import Promise from 'bluebird';

let apiLoaded = false;
let picker = null;

export function pick(oauthToken, developerKey)
{
	return loadApi()
	.then(() => { createPicker(oauthToken, developerKey)})
	.then(() =>
	{
		return new Promise((resolve, reject) =>
		{
			picker.setVisible(true);
			picker.setCallback((data) =>
			{
				if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
				{
					let doc = data[google.picker.Response.DOCUMENTS][0];
					let fileId = doc[google.picker.Document.ID];
					resolve(fileId);
				}
			});
		});
	});
}

function loadApi()
{
	return new Promise((resolve, reject) =>
	{
		if (apiLoaded)
		{
			resolve();
		}
		else
		{
			gapi.load('picker', {'callback': () => {
				apiLoaded = true;
				resolve();
			}});
		}
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
