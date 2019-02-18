import * as Handlebars from 'handlebars';
import * as htmlParser from 'node-html-parser';
import { Minko } from './Minko';
import { ComponentElement } from './dom/ComponentElement';

export interface Templates {
    markup: string;
    style: string;
    scripts: { [key: string]: (this: ComponentElement) => void; };
}

export class Component {

    /**
     * Component's name
     */
    public readonly name: string;

    public readonly minko: Minko;

    public file: string | undefined;

    /**
     * Template, style and scripts
     */
    public templates: Partial<Templates> = {};

    /**
     * @internal
     * Handlebars cache
     */
    private _handlebarsCache: any = {};

    /**
     * Creates a new component instance. Prefer using `Milk#addComponent` instead.
     * @param name Name of component
     * @param templates Templates object
     */
    constructor(name: string = 'component', minkoInstance: Minko, templates?: Partial<Templates>) {
        if (!isValidComponentName(name)) {
            throw `${name} > Invalid component name`;
        }

        this.minko = minkoInstance;
        this.name = name;

        if (typeof templates !== 'undefined') {
            this.templates = templates;
            this._updateTemplates();
        }
    }

    /**
     * @internal
     * **Must** be called after changing `this.templates` manually
     */
    public _updateTemplates() {
        // Preinitialize Handlebars template
        try {

            if (typeof this.templates.markup !== 'undefined') {
                this._handlebarsCache.markup = Handlebars.compile(this.templates.markup);
            }
            if (typeof this.templates.style !== 'undefined') {
                this._handlebarsCache.style = Handlebars.compile(this.templates.style);
            }

        } catch (error) {
            console.warn(`> An error occured when trying to initialize ${this.name} component with Handlebars.`);
            throw error;
        }
    }

    /**
     * @internal
     * Renders components and return raw markup (HTML string) and style (CSS string).
     * Does **not** parse child components, it only preprocess component himself.
     * Parsing of child component is done by `Milk#_generateComponent` using internal DOM.
     * @param props Passed properties
     */
    public _rawRender(dom: ComponentElement) {
        let renderer = {
            markup: '',
            style: '',
        };

        try {
            const scripts = this.templates.scripts;

            if (typeof scripts !== 'undefined' && typeof scripts.prerender !== 'undefined') {
                scripts.prerender.call(dom);
            }

            const variables = dom.variables;

            renderer = {

                markup: 'markup' in this._handlebarsCache
                            ? this._handlebarsCache.markup(variables)
                            : '',

                style:  'style' in this._handlebarsCache
                            ? this._handlebarsCache.style(variables)
                            : '',

            };

            if (!('markup' in this._handlebarsCache) && renderer.markup === '') {
                console.warn(`${this.name} > This component does not render any HTML because you do not have any <template> tag.`);
            }

        } catch (error) {
            console.warn(`> An error occured when trying to render ${this.name} component.`);
            throw error;
        }

        return renderer;
    }

    /**
     * @internal
     * Generate component DOM object.
     * @param props Passed property
     */
    public _render(dom: ComponentElement) {
        const { markup, style } = this._rawRender(dom);
        this.minko._cssString += `\n${style}`;

        const htmlNode = htmlParser.parse(markup) as htmlParser.HTMLElement;

        return htmlNode;
    }
}

export function isValidComponentName(name: string) {
    return /^[A-Za-z0-9\-_\:]+$/.test(name);
}
