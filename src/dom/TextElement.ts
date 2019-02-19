import * as htmlParser from 'node-html-parser';
import { Node, NodeScope } from './Node';

export class TextElement extends Node {
    public _textElement: htmlParser.TextNode;

    constructor(textElement: htmlParser.TextNode, scope: NodeScope) {
        super(textElement, scope);
        this._textElement = textElement;
    }

    get text() {
        return this._textElement.text;
    }
}
