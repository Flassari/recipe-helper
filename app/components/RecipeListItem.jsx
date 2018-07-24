import React from 'react';
import recipeManager from '../recipe-manager';

export default class extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state =  { inProgress: false };
	}
	
	onAddClick(e)
	{
		this.setState({inProgress: true});
		this.props.onAdd(this.props.id);
	}
	
	onInfoClick(e)
	{
		this.props.onInfo(this.props.id);
	}
	
	componentWillMount()
	{
		recipeManager.setListenerForRecipe(this.props.id, this.recipeStateUpdated.bind(this));
	}
	
	recipeStateUpdated(recipe)
	{
		this.setState({inProgress: recipe.inProgress});
	}
	
	componentWillUnmount()
	{
		recipeManager.setListenerForRecipe(this.props.id, null);
	}
	
	render()
	{
		var imageInlineStyle = {
			backgroundImage: this.props.img ? 'url(' + this.props.img + ')' : 'none'
		}
		// TODO: Disabled for now until new shopping list integration is implemented.
		var isAddButtonDisabled = true; //this.state.inProgress == true || this.props.ingredients.length == 0;
		
		return (
			<div className="recipeListItem">
				<div className="image" style={imageInlineStyle} onClick={this.onInfoClick.bind(this)}>
					<div className="name">{this.props.name}</div>
				</div>
				<button type="button" className="add" onClick={this.onAddClick.bind(this)} disabled={isAddButtonDisabled} >Add</button>
			</div>
		)
	}
}
