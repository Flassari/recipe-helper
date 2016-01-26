var React = require('react');
var Recipe = require('./recipe.jsx');

module.exports = React.createClass(
{
	render: function()
	{
		var children = [];
		for (var recipeCategory in this.props.recipes)
		{
			var recipes = this.props.recipes[recipeCategory];
			for (var i = 0; i < recipes.length; i++)
			{
				children.push(<Recipe key={this.props.id} clicked={this.props.clicked} {...recipes[i]}/>);
			}
		}
		return (<div>{children}</div>);
	}
});