var RecipeManager = function()
{
	this.listeners = {};
	this.recipesById = null;
}

RecipeManager.prototype.setRecipes = function(recipes)
{
	this.recipes = recipes;
	this.recipesById = {};

	for(var recipeCategory in recipes)
	{
		var recipesInCategory = recipes[recipeCategory];

		for (var i = 0; i < recipesInCategory.length; i++)
		{
			var recipe = recipesInCategory[i];
			this.recipesById[recipe.id] = recipe;
		}
	}
}

RecipeManager.prototype.setRecipeInProgress = function(recipeId, inProgress)
{
	var recipe = this.recipesById[recipeId];
	recipe.inProgress = inProgress;

	if (this.listeners[recipeId])
	{
		this.listeners[recipeId](recipe);
	}
}

RecipeManager.prototype.setListenerForRecipe = function(recipeId, fn)
{
	this.listeners[recipeId] = fn;
}

// Singleton
module.exports = new RecipeManager();