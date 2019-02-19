import * as htmlParser from 'node-html-parser';
import { Minko } from '../Minko';
import { NodeArray } from './NodeArray';

export interface NodeScope {
    minkoInstance: Minko;
    cssString: string;
}

export abstract class Node {
    public minko: Minko;

    protected _scope: NodeScope;
    private _nodeElement: htmlParser.Node;
    private _childrenCache: Map<htmlParser.Node, Node> = new Map<htmlParser.Node, Node>();

    constructor(nodeElement: htmlParser.Node, scope: NodeScope) {
        this._nodeElement = nodeElement;
        this._scope = scope;

        this.minko = this._scope.minkoInstance;
    }

    get children() {
        // We avoid circular imports by requiring children classes only when needed.
        const { TextElement } = require('./TextElement');
        const { ComponentElement } = require('./ComponentElement');
        const { HTMLElement } = require('./HTMLElement');

        // For each child we create a corresponding type
        const children = this._nodeElement.childNodes.map((e) => {
            if (!this._childrenCache.has(e)) {
                const minko = this._scope.minkoInstance;
                let node: Node;
                if (e instanceof htmlParser.TextNode) {
                    node = new TextElement(e, this._scope);
                } else if (e instanceof htmlParser.HTMLElement) {
                    if (minko.hasComponent(e.tagName)) {
                        node = new ComponentElement(e.tagName, e, this._scope);
                    } else {
                        node = new HTMLElement(e, this._scope);
                    }
                } else {
                    throw new Error('Node type unknown');
                }

                this._childrenCache.set(e, node);
            }

            return this._childrenCache.get(e)!;
        });

        return new NodeArray(children);
    }

    /**
     * @async
     * Renders the current Node
     * @param newNode Node to replace
     */
    async render(newNode?: htmlParser.Node): Promise<htmlParser.Node> {
        if (typeof newNode !== 'undefined') {
            this._nodeElement = newNode;
        }

        // We shallow a copy of node instance
        const nodeElement: htmlParser.Node = Object.assign(
            Object.create(
                Object.getPrototypeOf(this._nodeElement),
            ),
            this._nodeElement,
        );

        // Set children nodes to rendered nodes
        nodeElement.childNodes = await this.children.render();
        return nodeElement;
    }
}
