import React from 'react';
import Recipe from './recipe.jsx';

export default class RecipeList extends React.Component
{
	render()
	{
		let children = [];
		for (var recipeCategory in this.props.recipes)
		{
			let recipes = this.props.recipes[recipeCategory];
			for (let i = 0; i < recipes.length; i++)
			{
				children.push(<Recipe key={recipes[i].id} clicked={this.props.clicked} {...recipes[i]}/>);
			}
		}
		return (<div>{children}</div>);
	}
}
