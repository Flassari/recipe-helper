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

function getAuthToken(code)
{
	return $.ajax({
		url: tokenExchangerUrl,
		type : 'POST',
		data: 'code=' + code
	}).done(function() {
		localStorage.wunderlistAccessToken = response.access_token;
		return localStorage.wunderlistAccessToken;
	});
}

module.exports.getLists = function(clientId)
{
	return module.exports.logIn()
	.then(function(accessToken) {
		return $.ajax({
			url: 'https://a.wunderlist.com/api/v1/lists',
			type : 'GET',
			headers: {
				'X-Client-ID': clientId,
				'X-Access-Token': accessToken
			}
		});
	});
}

module.exports.addItems = function(listId, items, clientId, accessToken)
{
	var nonAddedItems = {};

	$.each(items, function(i, recipeItemString) {
		var recipeItem = new RecipeItem(recipeItemString);
		nonAddedItems[recipeItem.name] = recipeItem;
	});

	$.ajax({
		url: "https://a.wunderlist.com/api/v1/tasks",
		headers : {
            'X-Client-ID': clientId,
			'X-Access-Token': accessToken
        },
		data: {list_id: listId}
	}).done(function(tasks) {
		$.each(tasks, function(i, task) {
			var taskItem = new RecipeItem(task.title);

			if (nonAddedItems[taskItem.name] != undefined)
			{
				// The task item is already in the recipe, add the recipe item to it!
				taskItem.add(nonAddedItems[taskItem.name]);
				delete nonAddedItems[taskItem.name];

				$.ajax({
					url: "https://a.wunderlist.com/api/v1/tasks/" + task.id,
					type : "PATCH",
					headers : {
		                "Content-Type" : "application/json",
		                'X-Client-ID': clientId,
						'X-Access-Token': accessToken
		            },
					data: JSON.stringify({
						revision: task.revision,
						title: taskItem.getString()
					})
				});
			}

		});

		// Create new tasks for the ones that weren't updated
		$.each(nonAddedItems, function(nonAddedItemName, nonAddedItem) {
			var newCount = nonAddedItems[nonAddedItem];
			$.ajax({
				url: "https://a.wunderlist.com/api/v1/tasks",
				type : "POST",
				headers : {
	                "Content-Type" : "application/json",
	                'X-Client-ID': clientId,
					'X-Access-Token': accessToken
	            },
				data: JSON.stringify({
					list_id: listId,
					title: nonAddedItem.getString()
				})
			});
		});

	});
}

