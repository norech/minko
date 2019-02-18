console.log("First component rendering is always longer than subsequents renderings due to components caching.");
console.log("In most cases, the rendering will be cached.");

console.log(); // separator

console.time("Requiring Minko");
var { Minko } = require("../../build"); // use 'require("minko")' instead.
console.timeEnd("Requiring Minko");

var minko = new Minko();


console.log(); // separator



// Simple Page

console.time("'Simple Page' monofiles loading");
var simplePageComponentsRoot = __dirname + "/../simple-page/components";
minko.addComponentFromFile("app", simplePageComponentsRoot + "/app.mko");
minko.addComponentFromFile("page", simplePageComponentsRoot + "/page.mko");
console.timeEnd("'Simple Page' monofiles loading");

for(let i = 0; i < 3; i++) {
    console.time("'Simple Page' render " + i);
    minko.renderToString("app");
    console.timeEnd("'Simple Page' render " + i);
}


console.log(); // separator



// Hello World

console.time("'Hello World' monofiles loading");
var helloWorldComponentsRoot = __dirname + "/../hello-world/components";
minko.addComponentFromFile("hello-world", helloWorldComponentsRoot + "/hello-world.mko");
console.timeEnd("'Hello World' monofiles loading");

for(let i = 0; i < 3; i++) {
    console.time("'Hello World' render " + i);
    minko.renderToString("hello-world");
    console.timeEnd("'Hello World' render " + i);
}


console.log(); // separator



// Without Monofiles

console.time("'Without Monofiles' monofiles loading");
minko.addComponent('without-monofiles', {
    scripts: {
        prerender() {
            this.setVariables({
                myVar: "Hello World!"
            });
        },
    },

    markup: `
        <h1>{{ myVar }}</h1>
    `,

    style: `
        h1 {
            text-align: center;
        }
    `,
});
console.timeEnd("'Without Monofiles' monofiles loading");

for(let i = 0; i < 3; i++) {
    console.time("'Without Monofiles' render " + i);
    minko.renderToString("without-monofiles");
    console.timeEnd("'Without Monofiles' render " + i);
}