var React = require("react");
var ReactDOM = require("react-dom");

var RecipeList = require("./components/RecipeList.jsx");
var rootInstance = ReactDOM.render(<RecipeList />, document.body);

/*
if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      return [rootInstance];
    }
  });
}*/