require('babel-polyfill');
var React = require('react');
var ReactDOM = require('react-dom');
//?
console.log(`Client running in ${process.env.NODE_ENV} mode`);

var TestComponent = function(){
	return (
		<div>  
			hi
		</div>
	);
}

// document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<TestComponent />, document.getElementById('app'));
// });