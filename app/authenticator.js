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
			gapi.load('auth', {'callback': () => {
				apiLoaded = true;
				resolve();
			}});
		}
	});
}

export function authenticate(clientId, scope)
{
	let authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
		'response_type=token' +
		'&prompt=select_account' +
		'&scope=' + encodeURIComponent(scope) +
		'&redirect_uri=' + window.location.href +
		'&client_id=' + clientId;
	
	window.location.href = authUrl;
}