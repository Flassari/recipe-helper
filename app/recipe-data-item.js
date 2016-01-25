var quantities;
var name;

module.exports = function RecipeItem(str)
{
	quantities = {};
	var quantsAndNameMatch = str.match(/((?:\d+[^\d\s]*(?:\s\+\s)?)*)\s?(.*)/);
	var quantsString = quantsAndNameMatch[1];
	name = quantsAndNameMatch[2];

	var quantMatch, quantsMatchRegex = /(\d+)([^\d\s]*)/g;
	while(quantMatch = quantsMatchRegex.exec(quantsString))
	{
		quantities[quantMatch[2]] = parseInt(quantMatch[1]);
	}
}

module.exports.Add = function(otherRecipe)
{
	var otherHasQuantity = false;
	for (var quantityName in otherRecipe.quantities)
	{
		otherHasQuantity = true;

		if (this.quantities[quantityName])
		{
			this.quantities[quantityName] += otherRecipe.quantities[quantityName];
		} 
		else
		{
			this.quantities[quantityName] = otherRecipe.quantities[quantityName];
		}
	}

	if (!otherHasQuantity)
	{
		this.quantities[""] = this.quantities[""] ? this.quantities[""] + 1 : 1;
	}
}

module.exports.GetString = function()
{
	var returnStr = this.name;

	var quantityStrings = [];
	for (var quantityName in this.quantities)
	{
		quantityStrings.push(this.quantities[quantityName] + quantityName);
	}

	if (quantityStrings.length > 0)
	{
		returnStr = quantityStrings.join(" + ") + " " + returnStr;
	}
	return returnStr;
}