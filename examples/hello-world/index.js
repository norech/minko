var { Minko } = require("../../build"); // use 'require("minko")' instead.

var minko = new Minko();

minko.addComponentFromFile("hello-world", __dirname + "/components/hello-world.mko");

console.log(minko.renderToString("hello-world"));
