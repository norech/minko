var { Minko } = require("../../build"); // use 'require("minko")' instead.

var minko = new Minko();

minko.addComponentFromFile("async-worker", __dirname + "/components/async-worker.mko");

minko.renderToString("async-worker")
    .then(html => console.log(html))
    .catch(err => console.error(err));
