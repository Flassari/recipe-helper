var React = require('react');
var recipeManager = require('../recipe-manager.js');


module.exports = React.createClass(
{
	getInitialState: function() {
		return {inProgress: false};
	},
	handleClick: function (e)
	{
		this.setState({inProgress: true});
		this.props.clicked(this.props.id);
	},
	componentWillMount: function()
	{
		recipeManager.setListenerForRecipe(this.props.id, this.recipeStateUpdated);
	},
	recipeStateUpdated: function(recipe)
	{
		this.setState({inProgress: recipe.inProgress});
	},
	componentWillUnmount: function()
	{
		recipeManager.setListenerForRecipe(this.props.id, null);
	},
	render: function()
	{
		var styles = {
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
				<button type="button" onClick={this.handleClick} disabled={this.state.inProgress == true} >Add</button>
			</div>
		)
	}
});