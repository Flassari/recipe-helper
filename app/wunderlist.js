import Promise from 'bluebird';
import RecipeItem from './recipe-data-item.js';
import wurl from 'wurl';

// Returns access token if it can be gotten without redirection, null otherwise.
// If null is returned use authenticate(..) instead to go trough the whole flow.
export function getAccessToken(tokenExchangerUrl)
{
	if (localStorage.wunderlistAccessToken)
	{
		return Promise.resolve(localStorage.wunderlistAccessToken);
	}

	let code = wurl('?code');
	if (code) // User just returned from wunderlist auth page.
	{
		// Remove junk from url
		window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
		
		return getAuthToken(code, tokenExchangerUrl).then((accessToken) => {
			localStorage.wunderlistAccessToken = accessToken;
			return accessToken;
		});
	}
	
	return Promise.resolve(null);
}

export function authenticate(clientId)
{
	let path = 'https://www.wunderlist.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.href  + '&state=' + Math.random().toString(36);
	window.location.href = path;
	return null;
}
	
export function getLists(clientId, accessToken)
{
	return Promise.resolve($.ajax({
		url: 'https://a.wunderlist.com/api/v1/lists',
		type : 'GET',
		headers: {
			'X-Client-ID': clientId,
			'X-Access-Token': accessToken
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

		$.each(shoppingListItems, (i, shoppingListItem) =>
		{
			let shoppingListRecipeItem = new RecipeItem(shoppingListItem.title);
			let ingredientNameLowercase = shoppingListRecipeItem.name.toLocaleLowerCase();
			
			if (nonAddedItems[ingredientNameLowercase] != undefined)
			{
				// The task item is already in the recipe, add the recipe item to it!
				shoppingListRecipeItem.add(nonAddedItems[ingredientNameLowercase]);
				delete nonAddedItems[ingredientNameLowercase];
				requests.push(changeShoppingListItem(shoppingListItem.id, shoppingListItem.revision, shoppingListRecipeItem.getString(), clientId, accessToken));
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
		url: "https://a.wunderlist.com/api/v1/tasks",
		headers : {
			'X-Client-ID': clientId,
			'X-Access-Token': accessToken
		},
		data: {list_id: listId}
	});
}

function changeShoppingListItem(taskId, taskRevision, newTitle, clientId, accessToken)
{
	return $.ajax({
		url: "https://a.wunderlist.com/api/v1/tasks/" + taskId,
		type : "PATCH",
		headers : {
			"Content-Type" : "application/json",
			'X-Client-ID': clientId,
			'X-Access-Token': accessToken
		},
		data: JSON.stringify({
			revision: taskRevision,
			title: newTitle
		})
	});
}

function newShoppingListItem(newTitle, listId, clientId, accessToken)
{
	return $.ajax({
		url: "https://a.wunderlist.com/api/v1/tasks",
		type : "POST",
		headers : {
			"Content-Type" : "application/json",
			'X-Client-ID': clientId,
			'X-Access-Token': accessToken
		},
		data: JSON.stringify({
			list_id: listId,
			title: newTitle
		})
	});
}
