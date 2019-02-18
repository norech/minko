var { Minko } = require("../../build"); // use 'require("minko")' instead.

var minko = new Minko();

var componentsRoot = __dirname + "/components";

minko.addComponentFromFile("app", componentsRoot + "/app.mko");
minko.addComponentFromFile("page", componentsRoot + "/page.mko");


minko.renderToString("app")
    .then(html => console.log(html))
    .catch(err => console.error(err));
