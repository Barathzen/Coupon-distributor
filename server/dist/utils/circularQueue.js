"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularQueue = void 0;
class CircularQueue {
    items;
    head = 0;
    size;
    constructor(items) {
        this.items = items;
        this.size = items.length;
    }
    getNext() {
        const item = this.items[this.head];
        this.head = (this.head + 1) % this.size;
        return item;
    }
}
exports.CircularQueue = CircularQueue;
