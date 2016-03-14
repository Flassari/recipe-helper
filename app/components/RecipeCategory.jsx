import React from 'react';
import RecipeListItem from './RecipeListItem';

export default class extends React.Component
{
	render()
	{
		return (
			<div className="recipeCategory">
				<h1>{this.props.categoryName}</h1>
				<div className="recipes">{this.props.recipes.map((recipe) => {
					return <RecipeListItem key={recipe.id} onAdd={this.props.onAdd} onInfo={this.props.onInfo} {...recipe} />
				})}</div>
			</div>
		);
	}
}