export function parse(fileContent)
{
	let xmlDoc = parseHTML(fileContent);

	let currentRecipe = null;
	let recipesByCategory = { };
	let currentCategory = recipesByCategory['Default'] = [];
	let totalRecipeCount = 0;

	let imgUrl;

	for (let i = 0; i < xmlDoc.length; i++)
	{
		let node = xmlDoc[i];
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
				id: totalRecipeCount,
				nodes: []
			};
			totalRecipeCount++;
			currentCategory.push(currentRecipe);
		}
		else if (node.nodeName.substr(0, 1) === "H" && node.nodeName.length == 2) // Other
		{
			// Other header we don't care about, stop current recipe and ignore all until new recipe.
			currentRecipe = null;
		}
		else if (node.nodeName === "UL") // Recipe ingredients
		{
			if (currentRecipe !== null)
			{
				currentRecipe.nodes.push(node.outerHTML);
				
				for (let j = 0; j < node.children.length; j++)
				{
					currentRecipe.ingredients.push(node.children[j].innerText);
				}
			}
		}
		else if ((imgUrl = getNestedImage(node)) !== null) // Recipe image
		{
			if (currentRecipe !== null)
			{
				currentRecipe.img = imgUrl;
			}
		}
		else // Recipe instructions
		{
			if (currentRecipe !== null)
			{
				currentRecipe.nodes.push(node.outerHTML);
			}
		}
	}
	
	// Sort recipes alphabetically 
	for (let categoryName in recipesByCategory)
	{
		recipesByCategory[categoryName].sort((a, b) => {
			return a.name.localeCompare(b.name); 
		});
	}
	
	return recipesByCategory;
}

function parseHTML(str) {
	let htmlDoc = document.implementation.createHTMLDocument();
	htmlDoc.body.innerHTML = str;
	return htmlDoc.body.children;
}

function getNestedImage(node)
{
	if (node.nodeName === "IMG")
	{
		return node.src;
	}
	else
	{
		for (let i = 0; i < node.children.length; i++)
		{
			let childImg = getNestedImage(node.children[i]);
			if (childImg !== null)
			{
				return childImg;
			}
		}
	}
	return null;
}
