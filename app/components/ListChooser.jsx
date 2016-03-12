import React from 'react';

export default class extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	
	render()
	{
		let done = this.props.done;
		return (
			<div>
				{this.props.lists.map((list) => {
					return <ListItem {...list} done={done} />;
				})}
			</div>
		);
	}
}

class ListItem extends React.Component
{
	handleClick (e)
	{
		this.props.done(parseInt(this.props.id));
	}
	
	render()
	{
		return (<button type="button" onClick={this.handleClick.bind(this)}>{this.props.title}</button>);
	}
}
