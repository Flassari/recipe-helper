var React = require('react');

var ListItem = React.createClass(
{
	handleClick: function (e)
	{
		this.props.done(parseInt(this.props.id));
	},
	render: function()
	{
		return (<button type="button" onClick={this.handleClick}>{this.props.title}</button>);
	}
});

module.exports = React.createClass(
{
	render: function()
	{
		var done = this.props.done;
		return (
			<div>
				{this.props.lists.map(function(list) {
					return <ListItem {...list} done={done} />;
				})}
			</div>
		);
	}
});