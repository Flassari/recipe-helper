class RecipeManager
{
	setRecipes(recipes)
	{
		this.recipes = recipes;
		this.recipesById = {};
		this.listeners = {};

		for(let recipeCategory in recipes)
		{
			let recipesInCategory = recipes[recipeCategory];

			for (let i = 0; i < recipesInCategory.length; i++)
			{
				let recipe = recipesInCategory[i];
				this.recipesById[recipe.id] = recipe;
			}
		}
	}
	
	setRecipeInProgress(recipeId, inProgress)
	{
		let recipe = this.recipesById[recipeId];
		recipe.inProgress = inProgress;

		if (this.listeners[recipeId])
		{
			this.listeners[recipeId](recipe);
		}
	}

	setListenerForRecipe(recipeId, fn)
	{
		// If components are removing listeners when we have already cleared
		if (fn == null && this.listeners == null) return;

		this.listeners[recipeId] = fn;
	}
	
	clear()
	{
		this.recipes = null;
		this.recipesById = null;
		this.listeners = null;
	}
}

export default new RecipeManager();
