/**
 * This module implements a Singly Linked List data structure.
 * Node data must implement the `DataShapeWithValue` interface.
 * @module
 */

import { Node } from "./Nodes.ts";
import type { DataShapeWithValue } from "../interfaces/Comparable.ts";

/**
 * Implementation of a generic Singly Linked List.
 * Each node in the list contains a reference to the next node, but not the previous one.
 * Node data must implement the `DataShapeWithValue` interface, typically for tracking visited nodes in algorithms like graph traversals.
 * @template T The type of data stored in the list nodes. Must implement `DataShapeWithValue`.
 */
export class SinglyLinkedList<T extends DataShapeWithValue> {
  /**
   * The first node in the linked list.
   * @type {Node<T> | null}
   */
  head: Node<T> | null;
  /**
   * The last node in the linked list.
   * @type {Node<T> | null}
   */
  tail: Node<T> | null;
  /**
   * The number of nodes currently in the linked list.
   */
  length: number;

  /**
   * Creates a new, empty Singly Linked List.
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Checks if the linked list is empty.
   * @returns `true` if the list contains no nodes, `false` otherwise.
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Adds a new node with the given value to the beginning (head) of the list.
   * @param value The data to add to the new node. Must implement `DataShapeWithValue`.
   */
  addNodeAtHead(value: T): void {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  /**
   * Adds a new node with the given value to the end (tail) of the list.
   * @param value The data to add to the new node. Must implement `DataShapeWithValue`.
   */
  addNodeAtTail(value: T): void {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * Inserts a new node with the given value at a specific index in the list.
   * @param index The index at which to insert the new node (0-based).
   * @param value The data to add to the new node. Must implement `DataShapeWithValue`.
   * @throws {Error} If the index is out of bounds (less than 0 or greater than the list length).
   */
  insertNodeAt(index: number, value: T): void {
    if (index < 0 || index > this.length) {
      throw new Error("Index out of bounds");
    }
    if (index === 0) {
      this.addNodeAtHead(value);
    } else if (index === this.length) {
      this.addNodeAtTail(value);
    } else {
      const newNode = new Node(value);
      let current = this.head;
      let previous = null;
      for (let i = 0; i < index; i++) {
        previous = current;
        current = current!.next;
      }
      newNode.next = current;
      previous!.next = newNode;
      this.length++;
    }
  }

  /**
   * Removes and returns the data of the node at the beginning (head) of the list.
   * @returns The data of the removed head node, or `undefined` if the list is empty.
   */
  removeNodeAtHead(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const value = this.head!.data;
    this.head = this.head!.next;
    this.length--;
    if (this.isEmpty()) {
      this.tail = null;
    }
    return value;
  }

  /**
   * Removes and returns the data of the node at the end (tail) of the list.
   * @returns The data of the removed tail node, or `undefined` if the list is empty.
   */
  removeNodeAtTail(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    let current = this.head;
    let previous = null;
    while (current!.next !== null) {
      previous = current;
      current = current!.next;
    }
    const value = current!.data;
    if (previous === null) {
      this.head = null;
      this.tail = null;
    } else {
      previous.next = null;
      this.tail = previous;
    }
    this.length--;
    return value;
  }

  /**
   * Removes and returns the data of the node at a specific index in the list.
   * @param index The index of the node to remove (0-based).
   * @returns The data of the removed node, or `undefined` if the list is empty (though an error will be thrown for out-of-bounds indices).
   * @throws {Error} If the index is out of bounds (less than 0 or greater than or equal to the list length).
   */
  removeNodeAt(index: number): T | undefined {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }
    if (index === 0) {
      return this.removeNodeAtHead();
    } else if (index === this.length - 1) {
      return this.removeNodeAtTail();
    } else {
      let current = this.head;
      let previous = null;
      for (let i = 0; i < index; i++) {
        previous = current;
        current = current!.next;
      }
      const value = current!.data;
      previous!.next = current!.next;
      this.length--;
      return value;
    }
  }

  /**
   * Traverses the linked list from head to tail.
   * This method primarily exists for internal use or as a base for other operations.
   * To access node data during traversal, iterate through `list.head` and `node.next`.
   */
  traverse() {
    let current = this.head;
    while (current !== null) {
      // This loop currently just iterates without performing an action on the data.
      // Users would typically iterate externally or use a callback pattern for processing.
      current = current.next;
    }
  }
}
