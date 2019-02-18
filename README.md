# Minko

A simple but powerful backend rendering framework.

Inspired by the components concept behind other frameworks like React, Angular or Vue, Minko will try its best to provide an easy but powerful toolset to split your website views into easier to manage components.

## How to use

Minko was made to be very easy to setup and work without any extra build step.
Use it is simple as doing `npm install minko` and requiring it.

```
var Minko = require('minko').Minko;  // We require the class

var minko = new Minko();  // We create a new Minko instance

minko.addComponentFromFile("my-component", /* A Minko monofile path */);  // We load a component from a monofile

const htmlCode = await minko.renderToString("my-component");  // We render my-component and get an async html code (1)
```
*1: To use await, you will need to be inside an async method. If it isn't the case, consider using Promise "then" and "catch" methods*

See examples folder to see how powerful Minko is.


## How it works

In Minko, components are split into 3 parts, the scripts (JS), the markup (HTML) and the styles (CSS).

The scripts part is plain old JavaScript able to manage the other two parts.

Scripts are split into kinds, but currently the only script kind available is the `prerender` kind.
In monofiles, the kinds are represented by the presence of properties, like this: `<script prerender>...</script>`.

Those script have a special `this` variable containing its current Minko DOM representation (see src/dom/ComponentElement.ts).
It has access to component properties with `this.props` and component children array with `this.children`, it can also be used to change the way markup and styles are generated.

The markup and styles part are handled with Handlebars using the variables provided by the `prerender` script.
The variables can be set with `this.setVariables({ ... })` method.

Only markup is required to make a working component.

### Components ? Monofiles !

Minko is able without any other tool to load components in files called monofiles, made in a language called MinkoHTML.
This language was made to look like plain HTML, but it isn't, so don't confuse yourself.

```html
<script prerender>
    ...
</script>

<template>
    ...
</template>

<style>
    ...
</style>
```

MinkoHTML only supports some tags like `<script>`, `<template>` and `<style>`.

These tags are handled in special way. `<script>` is executed, `<template>` and `<style>` are preprocessed and rendered.

To add a component from monofiles, you can use/
```js
    minko.addComponentFromFile("my-component", __dirname + "/components/my-component.mko");
```

### Don't want monofiles ?

You really don't want to use monofiles ? No problem. Minko supports that.

```js
minko.addComponent('my-component', {
    scripts: {
        prerender: function () {
            this.setVariables({
                myVar: "Hello World!"
            });
            ...
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
```