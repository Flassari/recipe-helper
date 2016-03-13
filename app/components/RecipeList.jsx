import React from 'react';
import RecipeListItem from './RecipeListItem';
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
		for (var recipeCategory in this.props.recipes)
		{
			let recipes = this.props.recipes[recipeCategory];
			for (let i = 0; i < recipes.length; i++)
			{
				children.push(<RecipeListItem key={recipes[i].id} onAdd={this.props.onAdd} onInfo={this.onInfo.bind(this)} {...recipes[i]}/>);
			}
		}
		return <div>{children}</div>;
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
	}
}
