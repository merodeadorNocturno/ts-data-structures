export class Queue<T> {
  items: T[];
  constructor() {
    this.items = [];
  }

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.isEmpty() ? undefined : this.items.shift();
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toString(): string {
    return this.isEmpty() ? "" : this.items.join("->");
  }
}
