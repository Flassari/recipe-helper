import Promise from 'bluebird';
import wurl from 'wurl';

let googleAuthState = 'googleAuth';
let localStorageAccessTokenKeyName = 'googleAccessToken';

// Returns access token if it can be gotten without redirection, null otherwise.
// If null is returned use authenticate(..) instead to go trough the whole flow.
export function getAccessToken(clientId, scope)
{
	// Check if locally cached token is valid. 	
	let cachedToken = localStorage.getItem(localStorageAccessTokenKeyName);
	if (cachedToken)
	{
		return validateToken(cachedToken, clientId, scope)
		.then((isValid) => {
			if (isValid) {
				return Promise.resolve(cachedToken);
			}
			
			localStorage.removeItem(localStorageAccessTokenKeyName);
			return Promise.resolve(null);
		});
	}
	
	// Check if user just return from google auth page and validate token.
	let state = wurl('#state');
	if (state !== googleAuthState) return Promise.resolve(null);
	
	let accessToken = wurl('#access_token');
	if (!accessToken) return Promise.resolve(null);
	
	return validateToken(accessToken, clientId, scope)
	.then((isValid) => {
		if (isValid)
		{
			localStorage.setItem(localStorageAccessTokenKeyName, accessToken);
			return accessToken;
		}
		return null;
	});
}

export function authenticate(clientId, scope)
{
	let authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
		'response_type=token' +
		'&prompt=select_account' +
		'&state=' + googleAuthState +
		'&scope=' + encodeURIComponent(scope) +
		'&redirect_uri=' + window.location.href +
		'&client_id=' + clientId;
	
	window.location.href = authUrl;
}

function validateToken(accessToken, clientId, scope)
{
	return Promise.resolve($.ajax({
		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + accessToken
	}).then((response) => {
		if (response.error) return false;
		if (response.aud !== clientId) return false;
		if (response.scope !== scope) return false;
		
		return true;
	}));
}