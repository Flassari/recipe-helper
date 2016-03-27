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
			<div className="listChooser">
				<span>Which list should your shopping ingredients be added to?</span>
				<div className="lists">
					{this.props.lists.map((list) => {
						return <ListItem key={list.title} done={done} {...list} />;
					})}
				</div>
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
