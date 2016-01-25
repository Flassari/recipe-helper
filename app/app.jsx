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
	wunderlist.logIn(wunderlistClientId, wunderlistTokenExchanger)
	.then(onWunderlistLoggedIn);
}

function onWunderlistLoggedIn()
{
	if (localStorage.recipes)
	{
		showRecipes(JSON.parse(localStorage.recipes));
	}
	else
	{
		authenticator.authenticate(googleClientId, scope)
		.then(onAuthenticated)
		.then(function() { return filePicker.pick(accessToken, googleDeveloperKey); })
		.then(function(fileId) { return downloader.download(fileId, accessToken); })
		.then(function(fileContent) {
			var recipes = parser.parse(fileContent);
			localStorage.recipes = JSON.stringify(recipes); // Store on device
			showRecipes(recipes);
		});
		return null;
	}
}

function onAuthenticated(authResult)
{
	if (authResult && !authResult.error)
	{
		accessToken = authResult.access_token;
		return Promise.resolve();
	}
	return Promise.reject();
}

function showRecipes(recipes)
{
	ReactDOM.render(<RecipeList recipes={recipes} clicked={addRecipeToWunderlist}/>, document.getElementById('recipes'));
}

function addRecipeToWunderlist(recipe)
{
	console.log("Adding recipe " + recipe);
	wunderlist.addIngredients(recipe.ingredients);
}