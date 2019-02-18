import * as htmlParser from 'node-html-parser';
import { Node, NodeScope } from './Node';

export class HTMLElement extends Node {
    public _htmlElement: htmlParser.HTMLElement;

    constructor(htmlElement: htmlParser.HTMLElement, scope: NodeScope) {
        super(htmlElement, scope);
        this._htmlElement = htmlElement;
    }

    public get props() {
        const props = this._htmlElement.attributes;

        // We want className === class
        if (typeof props['class'] !== 'undefined') {
            props['className'] = props['class'];
        }

        return props;
    }
}
