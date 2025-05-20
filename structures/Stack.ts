export class Stack<T> {
  items: Map<number, T>;

  constructor() {
    this.items = new Map();
  }

  push(item: T): void {
    const index = this.items.size;
    this.items.set(index, item);
  }

  pop(): T | undefined {
    const index = this.items.size - 1;
    const pop = this.items.get(index);
    this.items.delete(index);
    return pop;
  }

  peek(): T | undefined {
    const last_index = this.items.size - 1;
    return this.items.get(last_index);
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }

  size(): number {
    return this.items.size;
  }

  clear(): void {
    this.items = new Map();
  }

  toString(): string {
    return this.items.toString();
  }

  toArray(): T[] {
    return Array.from(this.items.values());
  }
}
