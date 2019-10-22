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
					{this.props.lists.value.map((list) => {
						return <ListItem key={list.Name} done={done} {...list} />;
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
		this.props.done(this.props.Id);
	}
	
	render()
	{
		return (<button type="button" onClick={this.handleClick.bind(this)}>{this.props.Name}</button>);
	}
}
