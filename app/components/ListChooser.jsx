var React = require('react');

var ListItem = React.createClass(
{
	handleClick: function (e)
	{
		this.props.done(this.props.id);
	},
	render: function()
	{
		return (<button type="button" onClick={this.handleClick}>{this.props.title}</button>);
	}
});

module.exports = React.createClass(
{
	listChosen: function (listId)
	{
		this.props.done(listId);
	},
	render: function()
	{
		var children = [];
		for (var i = 0; i < this.props.lists.length; i++)
		{
			children.push(<ListItem {...this.props.lists[i]} done={this.listChosen} />);
		}
		return (<div>{children}</div>);
	}
});