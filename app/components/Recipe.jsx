import React from 'react';
import recipeManager from '../recipe-manager';

export default class Recipe extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state =  { inProgress: false };
	}
	
	handleClick(e)
	{
		this.setState({inProgress: true});
		this.props.clicked(this.props.id);
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
		let styles = {
			recipe: {
				width: 130,
				height: 170,
				background: '#ddd',
				textAlign: 'center',
				margin: '5px 5px',
				float: 'left',
			},
			image: {
				marginTop: 15,
				width: 100,
				height: 100,
				background: '#ccc',
			},
		};

		return (
			<div style={styles.recipe}>
				<img style={styles.image} src={this.props.img} />
				<div>{this.props.name}</div>
				<button type="button" onClick={this.handleClick.bind(this)} disabled={this.state.inProgress == true} >Add</button>
			</div>
		)
	}
}
