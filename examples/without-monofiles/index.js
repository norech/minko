var { Minko } = require("../../build"); // use 'require("minko")' instead.

var minko = new Minko();

minko.addComponent('my-component', {
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

minko.renderToString("my-component")
    .then(html => console.log(html))
    .catch(err => console.error(err));