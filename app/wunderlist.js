var Promise = require('bluebird');
var RecipeItem = require('./recipe-data-item.js');
var wurl = require('wurl');


module.exports.logIn = function(clientId, tokenExchangerUrl)
{
	if (localStorage.wunderlistAccessToken)
	{
		return Promise.resolve(localStorage.wunderlistAccessToken);
	}

	var code = wurl('?code');
	if (code) // User just returned from wunderlist auth page.
	{
		return getAuthToken(code, tokenExchangerUrl)
	}

	// Not logged in and not redirected from oauth page, redirect to log in page.
	var path = 'https://www.wunderlist.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.href  + '&state=' + Math.random().toString(36);
	window.location.href = path;
	return null;
}

function getAuthToken(code, tokenExchangerUrl)
{
	return Promise.resolve($.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).then(function(response) {
		var token = response.access_token;
		localStorage.wunderlistAccessToken = token;
		return token;
	}));
}

module.exports.getLists = function(clientId, accessToken)
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

module.exports.addItems = function(listId, items, clientId, accessToken)
{
	if (items.length == 0) return Promise.resolve();

	var nonAddedItems = {};

	$.each(items, function(i, recipeItemString) {
		var recipeItem = new RecipeItem(recipeItemString);
		nonAddedItems[recipeItem.name] = recipeItem;
	});

	return getTasks(listId, clientId, accessToken)
	.done(function(tasks) {
		var requests = [];

		$.each(tasks, function(i, task) {
			var taskItem = new RecipeItem(task.title);

			if (nonAddedItems[taskItem.name] != undefined)
			{
				// The task item is already in the recipe, add the recipe item to it!
				taskItem.add(nonAddedItems[taskItem.name]);
				delete nonAddedItems[taskItem.name];
				requests.push(changeTask(task.id, task.revision, taskItem.getString(), clientId, accessToken));
			}
		});

		// Create new tasks for the ones that weren't updated
		$.each(nonAddedItems, function(nonAddedItemName, nonAddedItem)
		{
			requests.push(newTask(nonAddedItem.getString(), listId, clientId, accessToken));
		});

		return Promise.all(requests)
	});
}

function getTasks(listId, clientId, accessToken)
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

function changeTask(taskId, taskRevision, newTitle, clientId, accessToken)
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


function newTask(newTitle, listId, clientId, accessToken)
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

