import * as htmlParser from 'node-html-parser';
import { HTMLElement } from './HTMLElement';
import { NodeScope, Node } from './Node';
import { Component } from '../Component';
import { NodeArray } from './NodeArray';

export class ComponentElement extends HTMLElement {
    public _component: Component;

    /**
     * Object where are passed variables to render.
     * To change a property, prefer `setVariables` method.
     */
    public variables: any = {};

    constructor(component: string, htmlElement: htmlParser.HTMLElement, scope: NodeScope) {
        super(htmlElement, scope);
        if (!this.minko.hasComponent(component)) {
            throw `${component} > Component not found.`;
        }
        this._component = this.minko.getComponent(component);
    }

    public get file() {
        return this._component.file;
    }

    /**
     * @internal
     * Renders components and return raw markup (HTML string) and style (CSS string).
     * Does **not** parse child components, it only preprocess component himself.
     * Parsing of child component is done by `ComponentElement#render` using internal DOM.
     */
    public async _rawRender() {
        let renderer = {
            markup: '',
            style: '',
        };

        try {
            const scripts = this._component.templates.scripts;

            if (typeof scripts !== 'undefined' && typeof scripts.prerender !== 'undefined') {
                await scripts.prerender.call(this);
            }

            const handlebarsCache = this._component._handlebarsCache;

            const variables = { ...this.variables };
            for (const key in variables) {
                const variable = variables[key];

                // We render variables before passing them to handlebars
                if (variable instanceof Node) {
                    variables[key] = (await variable.render()).toString();
                } else if (variable instanceof NodeArray) {
                    variables[key] = (await variable.render()).join('');
                }
            }

            renderer = {

                markup: 'markup' in handlebarsCache
                            ? handlebarsCache.markup(variables)
                            : '',

                style:  'style' in handlebarsCache
                            ? handlebarsCache.style(variables)
                            : '',

            };

            if (!('markup' in handlebarsCache) && renderer.markup === '') {
                console.warn(`${this._component.name} > This component does not render any HTML because you do not have any <template> tag.`);
            }

        } catch (error) {
            console.warn(`> An error occured when trying to render ${this._component.name} component.`);
            throw error;
        }

        return renderer;
    }

    /**
     * @internal
     * Generate component DOM object.
     */
    async render() {
        const { markup, style } = await this._rawRender();
        // We add component stylings to rendered CSS.
        this._scope.cssString += `\n${style}`;

        const newHtmlElement = htmlParser.parse(markup) as htmlParser.HTMLElement;

        return super.render(newHtmlElement);
    }

    /**
     * Set the variables for template and style.
     * @param variables
     */
    public setVariables(variables: Partial<any>) {
        this.variables = Object.assign(this.variables, variables);
    }
}
