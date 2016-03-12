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
	// TODO: Reject if API not loaded.
	return new Promise((resolve, reject) =>
	{
		gapi.auth.authorize({'client_id': clientId, 'scope': scope, 'immediate': false}, resolve);
	});
}
