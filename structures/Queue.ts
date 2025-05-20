/**
 * Implementation of a generic Queue data structure using an array.
 * Follows the First-In, First-Out (FIFO) principle.
 * @module
 */

/**
 * Implementation of a generic Queue data structure using an array.
 * Follows the First-In, First-Out (FIFO) principle.
 * @template T The type of elements stored in the queue.
 */
export class Queue<T> {
  /**
   * The internal array used to store queue elements.
   * @private
   */
  items: T[];

  /**
   * Creates a new, empty Queue.
   */
  constructor() {
    this.items = [];
  }

  /**
   * Adds an element to the back of the queue.
   * @param item The element to add to the queue.
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the element from the front of the queue.
   * Returns `undefined` if the queue is empty.
   * @returns The element at the front of the queue, or `undefined` if the queue is empty.
   */
  dequeue(): T | undefined {
    return this.isEmpty() ? undefined : this.items.shift();
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * Returns `undefined` if the queue is empty.
   * @returns The element at the front of the queue, or `undefined` if the queue is empty.
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0];
  }

  /**
   * Checks if the queue is empty.
   * @returns `true` if the queue contains no elements, `false` otherwise.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of elements in the queue.
   * @returns The number of elements in the queue.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Returns a string representation of the queue, showing elements from front to back.
   * Elements are joined by "->".
   * @returns A string representation of the queue.
   */
  toString(): string {
    return this.isEmpty() ? "" : this.items.join("->");
  }
}
