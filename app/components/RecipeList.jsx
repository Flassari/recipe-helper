import React from 'react';
import RecipeListItem from './RecipeListItem';

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
				children.push(<RecipeListItem key={recipes[i].id} clicked={this.props.clicked} {...recipes[i]}/>);
			}
		}
		return (<div>{children}</div>);
	}
}
