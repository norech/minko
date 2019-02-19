import * as htmlParser from 'node-html-parser';
import { Node } from './Node';

export class NodeArray<T extends Node> extends Array<T> {
    constructor(items: T[] | number = []) {
        if (typeof items === 'number') {
            super(items);
        } else {
            super(...items);
        }
        Object.setPrototypeOf(this, NodeArray.prototype);
    }

    async render(): Promise<htmlParser.Node[]> {
        return Promise.all(this.map(node => node.render()));
    }
}
