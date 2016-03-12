class RecipeManager
{
	constructor()
	{
		this.listeners = {};
		this.recipesById = null;
	}
	
	setRecipes(recipes)
	{
		this.recipes = recipes;
		this.recipesById = {};

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
		this.listeners[recipeId] = fn;
	}
}

export default new RecipeManager();
