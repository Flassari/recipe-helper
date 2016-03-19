export default class
{	
	constructor(str)
	{
		this.quantities = {};
		var quantsAndNameMatch = str.match(/((?:\d+[^\d\s]*(?:\s\+\s)?)*)\s?(.*)/);
		var quantsString = quantsAndNameMatch[1];
		this.name = quantsAndNameMatch[2];

		var quantMatch, quantsMatchRegex = /(\d+)([^\d\s]*)/g;
		while(quantMatch = quantsMatchRegex.exec(quantsString))
		{
			this.quantities[quantMatch[2]] = parseInt(quantMatch[1]);
		}
	}
	
	add(otherRecipe)
	{
		let otherHasQuantity = false;
		for (let quantityName in otherRecipe.quantities)
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
			this.quantities[""] = this.quantities[""] ? this.quantities[""] + 1 : 2;
		}
	}
	
	getString()
	{
		let returnStr = this.name;

		let quantityStrings = [];
		for (let quantityName in this.quantities)
		{
			quantityStrings.push(this.quantities[quantityName] + quantityName);
		}

		if (quantityStrings.length > 0)
		{
			returnStr = quantityStrings.join(" + ") + " " + returnStr;
		}
		return returnStr;
	}
}
