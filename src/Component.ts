import * as Handlebars from 'handlebars';
import * as htmlParser from 'node-html-parser';
import { Minko } from './Minko';
import { ComponentElement } from './dom/ComponentElement';

export interface Templates {
    markup: string;
    style: string;
    scripts: { [key: string]: (this: ComponentElement) => Promise<void>; };
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
    public _handlebarsCache: any = {};

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
}

export function isValidComponentName(name: string) {
    return /^[A-Za-z0-9\-_\:]+$/.test(name);
}
