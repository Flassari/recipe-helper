if (process.env.NODE_ENV === 'development') {
	// Reloading of index for development.
	require('../build/index.html');
}

import './style.scss'; // Style

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
let scope = 'https://www.googleapis.com/auth/drive.readonly';

let googleAccessToken;
let wunderlistAccessToken;
let shoppingListId;

window.onApiLoaded = () =>
{
	wunderlistLogIn()
	.then(getShoppingList)
	.then((listId) => {
		shoppingListId = parseInt(listId);
	})
	.then(clearMain)
	.then(downloadRecipes)
	.then((recipes) => {
		recipeManager.setRecipes(recipes);
		return recipes;
	})
	.then(showRecipes);
}

function downloadRecipes()
{
	return googleLogIn()
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

function wunderlistLogIn()
{
	return wunderlist.getAccessToken(wunderlistTokenExchanger)
	.then((accessToken) => {
		if (!accessToken)
		{
			ReactDOM.render(
				<div className="wunderlistLogin">
					Log in to Wunderlist to continue.
					<button onClick={() => { wunderlist.authenticate(wunderlistClientId) }} ><span>Log in to Wunderlist</span></button>
				</div>
			, document.getElementById('main'));
			return new Promise(() => {}); // Wait forever, next step is browser redirect.
		}
		
		wunderlistAccessToken = accessToken;
		return Promise.resolve(accessToken);
	});
}

function googleLogIn()
{
	if (googleAccessToken)
	{
		return Promise.resolve(googleAccessToken);
	}
	
	return authenticator.getAccessToken(googleClientId, scope)
	.then((accessToken) => {
		if (!accessToken)
		{
			ReactDOM.render(
				<div className="googleLogin">
					Log in to Drive and select your recipes document.
					<button  onClick={() => { authenticator.authenticate(googleClientId, scope) }} ><span>Log in to google</span></button>
				</div>
			, document.getElementById('main'));
			return new Promise(() => {}); // Wait forever, next step is browser redirect.
		}
		
		googleAccessToken = accessToken;
		return Promise.resolve(accessToken);
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
			<RecipeList recipes={recipes} onAdd={addRecipeToWunderlist.bind(this)} />
			<button type="button" style={{ marginTop: '25px' }} onClick={logOut}>Log out</button>
		</div>
	, document.getElementById('main'));
}

function logOut()
{
	localStorage.clear();
	location.reload();
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