var { Minko } = require("../../build"); // use 'require("minko")' instead.

console.time("Full Minko")

var minko = new Minko();

var componentsRoot = __dirname + "/components";

minko.addComponentFromFile("app", componentsRoot + "/app.mko");
minko.addComponentFromFile("page", componentsRoot + "/page.mko");


console.time("Render Minko")
console.log(minko.renderToString("app"));
console.timeEnd("Render Minko")

console.timeEnd("Full Minko")