var React = require('react');


module.exports = React.createClass({
	handleClick: function (e)
	{
		this.props.clicked(this.props);
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
				<button type="button" onClick={this.handleClick}>Add</button>
			</div>
		)
	}
});