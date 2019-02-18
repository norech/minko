import * as htmlParser from 'node-html-parser';
import { HTMLElement } from './HTMLElement';
import { NodeScope } from './Node';

export class ComponentElement extends HTMLElement {
    public _component: string;

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
        this._component = component;
    }

    public get file() {
        return this.minko.getComponent(this._component).file;
    }

    render() {
        const newHtmlElement = this.minko.getComponent(this._component)._render(this);

        return super.render(newHtmlElement);
    }

    toString() {
        return this.render().toString();
    }

    /**
     * Set the variables for template and style.
     * @param variables
     */
    public setVariables(variables: Partial<any>) {
        this.variables = Object.assign(this.variables, variables);
    }
}
