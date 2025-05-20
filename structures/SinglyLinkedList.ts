import { Node } from "./Nodes.ts";
import type { DataShapeWithValue } from "../interfaces/Comparable.ts";

export class SinglyLinkedList<T extends DataShapeWithValue> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

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

  traverse() {
    let current = this.head;
    while (current !== null) {
      current = current.next;
    }
  }
}
