var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="RecipeList-wrapper">
				{props.name}
			</div>
		)
	}
});