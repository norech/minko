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

    toString() {
        return this.join('');
    }
}
