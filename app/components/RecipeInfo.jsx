import React from 'react';

export default class extends React.Component
{
	render()
	{
		let nodes = this.props.recipe.nodes.map((nodeStr) => {
			var node = document.createElement('div');
			node.innerHTML = nodeStr;
			return node;
		});
		return (
			<div className="recipeInfo">
				<button className="buttonBack" onClick={this.props.onClose}>Back</button>			
				<div className="content">
					<h1>{this.props.recipe.name}</h1>
					<img src={this.props.recipe.img} />
					<div className="instructions">
						{this.props.recipe.nodes.map((nodeStr) => {
							return <div dangerouslySetInnerHTML={{__html: nodeStr}} />
						})}
					</div>
				</div>
			</div>
		);
	}
}