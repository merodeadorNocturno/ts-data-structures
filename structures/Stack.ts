/**
 * Implementation of a generic Stack data structure using a Map.
 * Follows the Last-In, First-Out (LIFO) principle.
 * @module
 */

/**
 * Implementation of a generic Stack data structure using a Map.
 * Follows the Last-In, First-Out (LIFO) principle.
 * @template T The type of elements stored in the stack.
 */
export class Stack<T> {
  /**
   * The internal Map used to store stack elements.
   * Keys are numerical indices representing the order of elements.
   * @private
   */
  items: Map<number, T>;

  /**
   * Creates a new, empty Stack.
   */
  constructor() {
    this.items = new Map();
  }

  /**
   * Adds an element to the top of the stack.
   * @param item The element to add to the stack.
   */
  push(item: T): void {
    const index = this.items.size;
    this.items.set(index, item);
  }

  /**
   * Removes and returns the element from the top of the stack.
   * Returns `undefined` if the stack is empty.
   * @returns The element at the top of the stack, or `undefined` if the stack is empty.
   */
  pop(): T | undefined {
    const index = this.items.size - 1;
    const pop = this.items.get(index);
    this.items.delete(index);
    return pop;
  }

  /**
   * Returns the element at the top of the stack without removing it.
   * Returns `undefined` if the stack is empty.
   * @returns The element at the top of the stack, or `undefined` if the stack is empty.
   */
  peek(): T | undefined {
    const last_index = this.items.size - 1;
    return this.items.get(last_index);
  }

  /**
   * Checks if the stack is empty.
   * @returns `true` if the stack contains no elements, `false` otherwise.
   */
  isEmpty(): boolean {
    return this.items.size === 0;
  }

  /**
   * Returns the number of elements in the stack.
   * @returns The number of elements in the stack.
   */
  size(): number {
    return this.items.size;
  }

  /**
   * Removes all elements from the stack, making it empty.
   */
  clear(): void {
    this.items = new Map();
  }

  /**
   * Returns a string representation of the stack.
   * Note: Map's default `toString` might not be ideal for visual stack representation.
   * Consider iterating `toArray()` for a specific format if needed.
   * @returns A string representation of the stack.
   */
  toString(): string {
    return this.items.toString();
  }

  /**
   * Returns an array containing all elements in the stack, from bottom to top.
   * @returns An array of elements in the stack.
   */
  toArray(): T[] {
    return Array.from(this.items.values());
  }
}
