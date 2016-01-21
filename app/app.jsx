var React = require('react');
var ReactDOM = require('react-dom');

var RecipeList = require('./components/RecipeList.jsx');

var authenticator = require('./authenticator.js');
var filePicker = require('./drive-picker.js');
var downloader = require('./drive-document-downloader.js');

var wunderlist = require('./wunderlist.js');;
var parser = require('./recipe-parser.js');

// --- Generate these yourself if forking this project ---
var wunderlistClientId = '950a881bc370b266e57d';
var googleDeveloperKey = 'AIzaSyDIDYjtJyFO8uvHs0020b7eH7fromVbS-U';
var googleClientId = '866832706562-g20thf05bjaif1m44fr779is60bjo7v1.apps.googleusercontent.com';
// See wunderlist_token_exchanger.php for example implementation of token.php, you'll need to host this yourself.
var wunderlistTokenExchanger = 'http://flassari.is/wunderlist/token.php';

// Scope for readonly access.
var scope = ['https://www.googleapis.com/auth/drive.readonly'];

var accessToken;

window.onApiLoaded = function()
{
	wunderlist.on('loggedIn', onWunderlistLoggedIn)
	wunderlist.logIn(wunderlistClientId, wunderlistTokenExchanger);
}

function onWunderlistLoggedIn()
{
	if (localStorage.recipes)
	{
		showRecipes(JSON.parse(localStorage.recipes));
	}
	else
	{
		authenticator.on('done', onAuthenticated)
		filePicker.on('done', onFilePicked)
		downloader.on('done', onFileDownloaded);

		filePicker.initialize();
		downloader.initialize();
		authenticator.authenticate(googleClientId, scope);
	}
}

function onAuthenticated(authResult)
{
	if (authResult && !authResult.error)
	{
		accessToken = authResult.access_token;
		filePicker.pick(authResult.access_token, googleDeveloperKey);
	}
}

function onFilePicked(fileId)
{
	downloader.download(fileId, accessToken);
}

function onFileDownloaded(fileContent)
{
	var recipes = parser.parse(fileContent);

	// Store on device
	localStorage.recipes = JSON.stringify(recipes);

	showRecipes(recipes);
}

function showRecipes(recipes)
{
	ReactDOM.render(<RecipeList recipes={recipes} />, document.getElementById('recipes'));
}