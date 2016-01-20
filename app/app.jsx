var React = require("react");
var ReactDOM = require("react-dom");

var authenticator = require('./authenticator.js');
var filePicker = require('./drive-picker.js');
var downloader = require('./drive-document-downloader.js');

var parser = require('./recipe-parser.js');

var RecipeList = require('./components/RecipeList.jsx');

// The Browser API key obtained from the Google Developers Console.
var developerKey = 'AIzaSyDIDYjtJyFO8uvHs0020b7eH7fromVbS-U';
// The Client ID obtained from the Google Developers Console. Replace with your own Client ID.
var clientId = "866832706562-g20thf05bjaif1m44fr779is60bjo7v1.apps.googleusercontent.com"
// Scope for readonly access.
var scope = ['https://www.googleapis.com/auth/drive.readonly'];

var accessToken;

window.onApiLoaded = function()
{
	authenticator.on('done', onAuthenticated)
	filePicker.on('done', onFilePicked)
	downloader.on('done', onFileDownloaded);

	filePicker.initialize();
	downloader.initialize();
	authenticator.authenticate(clientId, scope);
}

function onAuthenticated(authResult)
{
	if (authResult && !authResult.error)
	{
		accessToken = authResult.access_token;
		filePicker.pick(authResult.access_token, developerKey);
	}
}

function onFilePicked(fileId)
{
	downloader.download(fileId, accessToken);
}

function onFileDownloaded(fileContent)
{
	console.log("File downloaded with length of " + fileContent.length);
	var recipes = parser.parse(fileContent);

	ReactDOM.render(<RecipeList recipes={recipes} />, document.getElementById('recipes'));
}