var Promise = require('bluebird');
var React = require('react');
var ReactDOM = require('react-dom');
var RecipeList = require('./components/RecipeList.jsx');
var ListChooser = require('./components/ListChooser.jsx');

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
var shoppingListId;

window.onApiLoaded = function()
{
	wunderlist.logIn(wunderlistClientId, wunderlistTokenExchanger)
	.then(getShoppingList)
	.then(function(listId) {
		shoppingListId = listId;
	})
	.then(getRecipes)
	.then(showRecipes)
}

function getRecipes()
{
	if (localStorage.recipes)
	{
		return Promise.resolve(JSON.parse(localStorage.recipes));
	}
	else
	{
		return authenticator.authenticate(googleClientId, scope)
		.then(onAuthenticated)
		.then(function() { return filePicker.pick(accessToken, googleDeveloperKey); })
		.then(function(fileId) { return downloader.download(fileId, accessToken); })
		.then(function(fileContent) {
			var recipes = parser.parse(fileContent);
			localStorage.recipes = JSON.stringify(recipes); // Store on device
			return recipes;
		});
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

function getShoppingList()
{
	if (localStorage.shoppingList)
	{
		return Promise.resolve(localStorage.shoppingList);
	}

	return wunderlist.getLists(wunderlistClientId)
	.then(function(lists) {
		return new Promise(function( resolve, reject) {
			ReactDOM.render(<ListChooser lists={lists} done={resolve}/>, document.getElementById('main'));
		});
	}).then(function(listId) {
		localStorage.shoppingList = listId;
		return listId;
	});
}

function showRecipes(recipes)
{
	ReactDOM.render(<RecipeList recipes={recipes} clicked={addRecipeToWunderlist}/>, document.getElementById('main'));
}

function addRecipeToWunderlist(recipe)
{
	console.log("Adding recipe " + recipe);
	wunderlist.addItems(recipe.ingredients);
}