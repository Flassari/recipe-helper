import Promise from 'bluebird';
import RecipeItem from './recipe-data-item.js';
import wurl from 'wurl';

// Manage scope here:
// https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

// Returns access token if it can be gotten without redirection, null otherwise.
// If null is returned use authenticate(..) instead to go trough the whole flow.
export function getAccessToken(tokenExchangerUrl)
{
	if (localStorage.microsoftTodoAccessToken)
	{
		return Promise.resolve(localStorage.microsoftTodoAccessToken);
	}

	let code = wurl('?code');
	if (code) // User just returned from auth page.
	{
		// Remove junk from url
		window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
		
		return getAuthToken(code, tokenExchangerUrl).then((accessToken) => {
			localStorage.microsoftTodoAccessToken = accessToken;
			return accessToken;
		});
	}
	
	return Promise.resolve(null);
}

export function authenticate(clientId)
{
	let redirect_uri = window.location.href;
	if (redirect_uri.endsWith("/"))
	{
		redirect_uri = redirect_uri.substring(0, redirect_uri.length-1);
	}
	let path = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId + '&redirect_uri=' + redirect_uri  + '&response_type=code&scope=https%3A%2F%2Foutlook.office.com%2Ftasks.readwrite';
	window.location.href = path;
	return null;
}
	
export function getLists(clientId, accessToken)
{
	return Promise.resolve($.ajax({
		url: 'https://outlook.office.com/api/v2.0/me/taskfolders',
		type : 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		}
	}));
}
	
export function addItems(listId, items, clientId, accessToken)
{
	if (items.length == 0) return Promise.resolve();

	let nonAddedItems = {};

	$.each(items, (i, recipeItemString) =>
	{
		let recipeItem = new RecipeItem(recipeItemString);
		nonAddedItems[recipeItem.name.toLocaleLowerCase()] = recipeItem;
	});

	return getCurrentShoppingList(listId, clientId, accessToken)
	.done((shoppingListItems) =>
	{
		let requests = [];

		$.each(shoppingListItems.value, (i, shoppingListItem) =>
		{
			let shoppingListRecipeItem = new RecipeItem(shoppingListItem.Subject);
			let ingredientNameLowercase = shoppingListRecipeItem.name.toLocaleLowerCase();
			
			if (nonAddedItems[ingredientNameLowercase] != undefined)
			{
				// The task item is already in the recipe, add the recipe item to it!
				shoppingListRecipeItem.add(nonAddedItems[ingredientNameLowercase]);
				delete nonAddedItems[ingredientNameLowercase];
				requests.push(changeShoppingListItem(shoppingListItem.Id, shoppingListRecipeItem.getString(), clientId, accessToken));
			}
		});

		// Create new tasks for the ones that weren't updated
		$.each(nonAddedItems, (nonAddedItemName, nonAddedItem) =>
		{
			requests.push(newShoppingListItem(nonAddedItem.getString(), listId, clientId, accessToken));
		});

		return Promise.all(requests)
	});
}

function getAuthToken(code, tokenExchangerUrl)
{
	return Promise.resolve($.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).then((response) => {
		return response.access_token;
	}));
}

function getCurrentShoppingList(listId, clientId, accessToken)
{
	return $.ajax({
		url: "https://outlook.office.com/api/v2.0/me/taskfolders('" + listId + "')/tasks",
		headers : {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		}
	})
	.error(function(jqXHR, textStatus, errorThrown) {
		localStorage.removeItem("microsoftTodoAccessToken"); 
		authenticate(clientId);
	});
}

function changeShoppingListItem(taskId, newTitle, clientId, accessToken)
{
	return $.ajax({
		url: "https://outlook.office.com/api/v2.0/me/tasks/" + taskId,
		type : "PATCH",
		headers : {
			'Content-Type' : 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		},
		data: JSON.stringify({
			Subject: newTitle
		})
	});
}

function newShoppingListItem(newTitle, listId, clientId, accessToken)
{
	return $.ajax({
		url: "https://outlook.office.com/api/v2.0/me/taskfolders('" + listId + "')/tasks",
		type : "POST",
		headers : {
			'Content-Type' : 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		},
		data: JSON.stringify({
			Subject: newTitle
		})
	});
}
