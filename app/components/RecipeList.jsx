import React from 'react';
import RecipeCategory from './RecipeCategory';
import RecipeInfo from './RecipeInfo';

import recipeManager from '../recipe-manager';

export default class RecipeList extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state =  { showRecipe: null };
	}
	
	render()
	{
		if (this.state.showRecipe === null)
			return this.renderRecipeList();
		else
			return this.renderRecipeInfo();
	}
	
	renderRecipeList()
	{
		let children = [];
		for (let recipeCategory in this.props.recipes)
		{
			let recipes = this.props.recipes[recipeCategory];
			if (recipes.length > 0)
			{
				children.push(<RecipeCategory key={recipeCategory} categoryName={recipeCategory} recipes={recipes} onInfo={this.onInfo.bind(this)} onAdd={this.props.onAdd}/>);
			}
		}
		return <div className="recipeList">NOTE: Shopping list integration is temporarily removed until a Wunderlist alternative is found.<br/>
			{children}</div>;
	}
	
	renderRecipeInfo()
	{
		return <RecipeInfo recipe={this.state.showRecipe} onClose={() => {
			this.setState({ showRecipe: null });
		}}/>
	}
	
	onInfo(recipeId)
	{
		this.setState({ showRecipe: recipeManager.recipesById[recipeId] });
		window.scrollTo(0, 0);
	}
}
