function getNestedImage(node)
{
	if (node.nodeName === "IMG")
	{
		return node.src;
	}
	else
	{
		for (var i = 0; i < node.children.length; i++)
		{
			var childImg = getNestedImage(node.children[i]);
			if (childImg !== null)
			{
				return childImg;
			}
		}
	}
	return null;
}

module.exports.parse = function(fileContent)
{
	var xmlDoc = $.parseHTML( fileContent );

	var currentRecipe = null;
	var recipesByCategory = { };
	var currentCategory = recipesByCategory['Default'] = [];
	var totalRecipeCount = 0;

	var imgUrl;

	for (var i = 0; i < xmlDoc.length; i++)
	{
		var node = xmlDoc[i];
		if (node.nodeName === "H1") // New recipe category
		{
			currentCategory = recipesByCategory[node.innerText] = [];
			currentRecipe = null;
		}
		else if (node.nodeName === "H2") // New recipe
		{
			currentRecipe = {
				name: node.innerText,
				ingredients: [],
				id: totalRecipeCount
			};
			totalRecipeCount++;
			currentCategory.push(currentRecipe);
		}
		else if (node.nodeName === "UL") // Recipe ingredients
		{
			if (currentRecipe !== null)
			{
				for (var j = 0; j < node.children.length; j++)
				{
					currentRecipe.ingredients.push(node.children[j].innerText);
				}
			}
		}
		else if (node.nodeName.substr(0, 1) === "H" && node.nodeName.length == 2)
		{
			// Other header we don't care about, ignore.
			currentRecipe = null;
		}
		else if ((imgUrl = getNestedImage(node)) !== null)
		{
			if (currentRecipe !== null)
			{
				currentRecipe.img = imgUrl;
			}
		}
	}

	return recipesByCategory;
}