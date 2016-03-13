import Promise from 'bluebird';
import RecipeItem from './recipe-data-item.js';
import wurl from 'wurl';

export function logIn(clientId, tokenExchangerUrl)
{
	if (localStorage.wunderlistAccessToken)
	{
		return Promise.resolve(localStorage.wunderlistAccessToken);
	}

	let code = wurl('?code');
	if (code) // User just returned from wunderlist auth page.
	{
		return getAuthToken(code, tokenExchangerUrl)
	}

	// Not logged in and not redirected from oauth page, redirect to log in page.
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
		nonAddedItems[recipeItem.name] = recipeItem;
	});

	return getCurrentShoppingList(listId, clientId, accessToken)
	.done((shoppingListItems) =>
	{
		let requests = [];

		$.each(shoppingListItems, (i, shoppingListItem) =>
		{
			let shoppingListRecipeItem = new RecipeItem(shoppingListItem.title);

			if (nonAddedItems[shoppingListRecipeItem.name] != undefined)
			{
				// The task item is already in the recipe, add the recipe item to it!
				shoppingListRecipeItem.add(nonAddedItems[shoppingListRecipeItem.name]);
				delete nonAddedItems[shoppingListRecipeItem.name];
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
		let token = response.access_token;
		localStorage.wunderlistAccessToken = token;
		return token;
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
