import './app.scss'; // Style

import Promise from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';

import RecipeList from './components/RecipeList';
import ListChooser from './components/ListChooser';

import * as authenticator from './authenticator';
import * as filePicker from './drive-picker';
import * as downloader from './drive-document-downloader';
import * as wunderlist from './wunderlist';
import * as recipeParser from './recipe-parser';

import recipeManager from './recipe-manager';

// --- Generate these yourself if forking this project ---
let wunderlistClientId = '950a881bc370b266e57d';
let googleDeveloperKey = 'AIzaSyDIDYjtJyFO8uvHs0020b7eH7fromVbS-U';
let googleClientId = '866832706562-g20thf05bjaif1m44fr779is60bjo7v1.apps.googleusercontent.com';
// See wunderlist_token_exchanger.php for example implementation of token.php, you'll need to host this yourself.
let wunderlistTokenExchanger = 'http://flassari.is/wunderlist/token.php';

// Scope for readonly access.
let scope = ['https://www.googleapis.com/auth/drive.readonly'];

let googleAccessToken;
let wunderlistAccessToken;
let shoppingListId;

window.onApiLoaded = () =>
{
	wunderlist.logIn(wunderlistClientId, wunderlistTokenExchanger)
	.then((accessToken) => {
		wunderlistAccessToken = accessToken;
	})
	.then(getShoppingList)
	.then((listId) => {
		shoppingListId = parseInt(listId);
	})
	.then(clearMain)
	.then(getRecipes)
	.then((recipes) => {
		recipeManager.setRecipes(recipes);
		return recipes;
	})
	.then(showRecipes);
}

function getRecipes()
{
	if (localStorage.recipes)
	{
		return JSON.parse(localStorage.recipes);
	}
	return downloadAndCacheRecipes();
}

function downloadAndCacheRecipes()
{
	return authenticate()
	.then(getDriveFileId)
	.then((fileId) => {
		ReactDOM.render(<div>Loading recipes...</div>, document.getElementById('main'));
		return fileId;
	})
	.then((fileId) => { 
		return downloader.download(fileId, googleAccessToken);
	})
	.then((fileContent) => {
		let recipes = recipeParser.parse(fileContent);
		localStorage.recipes = JSON.stringify(recipes); // Store on device
		return recipes;
	});
}

function getDriveFileId()
{
	if (localStorage.fileId)
	{
		return localStorage.fileId;
	}

	return pickDriveFile();
}

function pickDriveFile()
{
	// Returns fileID string.
	return filePicker.pick(googleAccessToken, googleDeveloperKey)
	.then((fileId) => {
		localStorage.fileId = fileId;
		return fileId;
	});
}

function authenticate()
{
	if (googleAccessToken)
	{
		return Promise.resolve(googleAccessToken);
	}

	return authenticator.loadApi().then(() => {
		return new Promise((resolve, reject) => {
			ReactDOM.render(<button type="button" onClick={resolve} >Log into google</button>, document.getElementById('main'));
		});
	})
	.then(() => {
		clearMain();
		return authenticator.authenticate(googleClientId, scope);
	})
	.then((authResult) => {
		if (authResult && !authResult.error)
		{
			googleAccessToken = authResult.access_token;
			return Promise.resolve(googleAccessToken);
		}
		return Promise.reject();
	});
}

function getShoppingList()
{
	if (localStorage.shoppingList)
	{
		return localStorage.shoppingList;
	}

	return wunderlist.getLists(wunderlistClientId, wunderlistAccessToken)
	.then((lists) => {
		return new Promise((resolve, reject) => {
			ReactDOM.render(<ListChooser lists={lists} done={resolve}/>, document.getElementById('main'));
		});
	}).then((listId) => {
		localStorage.shoppingList = listId;
		return listId;
	});
}

function showRecipes(recipes)
{
	ReactDOM.render(
		<div>
			<button type="button" onClick={refreshRecipes} >Refresh recipes</button>
			<RecipeList recipes={recipes} onAdd={addRecipeToWunderlist.bind(this)} />
		</div>
	, document.getElementById('main'));
}

function refreshRecipes()
{
	clearMain();
	downloadAndCacheRecipes()
	.then(showRecipes);
}

function clearMain()
{
	ReactDOM.render(<div />, document.getElementById('main'));
}

function addRecipeToWunderlist(recipeId)
{
	recipeManager.setRecipeInProgress(recipeId, true);
	console.log("Adding recipe.");

	let recipe = recipeManager.recipesById[recipeId];

	wunderlist.addItems(shoppingListId, recipe.ingredients, wunderlistClientId, wunderlistAccessToken)
	.then(() => {
		console.log("Recipe added.");
		recipeManager.setRecipeInProgress(recipeId, false);
	});
}