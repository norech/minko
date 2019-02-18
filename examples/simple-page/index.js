var { Minko } = require("../../build"); // use 'require("minko")' instead.

var minko = new Minko();

var componentsRoot = __dirname + "/components";

minko.addComponentFromFile("app", componentsRoot + "/app.mko");
minko.addComponentFromFile("page", componentsRoot + "/page.mko");


console.log(minko.renderToString("app"));
