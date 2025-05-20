import { assertEquals, assertThrows } from "jsr:@std/assert";
import { SinglyLinkedList } from "../structures/SinglyLinkedList.ts";
// import { NumberWrapper } from "../utils/NumberWrapper.ts"; // Using a local test class instead

// Define a class that implements DataShapeWithValue for testing purposes
class TestNumberData {
  value: number;
  [key: string]: unknown; // Index signature

  constructor(value: number) {
    this.value = value;
  }
}

Deno.test("SinglyLinkedList - isEmpty", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  assertEquals(list.isEmpty(), true);
  list.addNodeAtHead(new TestNumberData(1));
  assertEquals(list.isEmpty(), false);
});

Deno.test("SinglyLinkedList - addNodeAtHead", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtHead(new TestNumberData(1));
  assertEquals(list.head!.data.value, 1);
  assertEquals(list.tail!.data.value, 1);
  list.addNodeAtHead(new TestNumberData(2));
  assertEquals(list.head!.data.value, 2);
  assertEquals(list.tail!.data.value, 1);
});

Deno.test("SinglyLinkedList - addNodeAtTail", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtTail(new TestNumberData(1));
  assertEquals(list.head!.data.value, 1);
  assertEquals(list.tail!.data.value, 1);
  list.addNodeAtTail(new TestNumberData(2));
  assertEquals(list.head!.data.value, 1);
  assertEquals(list.tail!.data.value, 2);
});

Deno.test("SinglyLinkedList - insertNodeAt", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtTail(new TestNumberData(1));
  list.addNodeAtTail(new TestNumberData(3));
  list.insertNodeAt(1, new TestNumberData(2));
  assertEquals(list.head!.next!.data.value, 2);
  assertThrows(() => list.insertNodeAt(-1, new TestNumberData(0)), Error, "Index out of bounds");
  assertThrows(() => list.insertNodeAt(4, new TestNumberData(0)), Error, "Index out of bounds");
});

Deno.test("SinglyLinkedList - removeNodeAtHead", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtHead(new TestNumberData(1));
  list.addNodeAtHead(new TestNumberData(2));
  assertEquals(list.removeNodeAtHead()?.value, 2);
  assertEquals(list.removeNodeAtHead()?.value, 1);
  assertEquals(list.removeNodeAtHead(), undefined);
});

Deno.test("SinglyLinkedList - removeNodeAtTail", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtTail(new TestNumberData(1));
  list.addNodeAtTail(new TestNumberData(2));
  assertEquals(list.removeNodeAtTail()?.value, 2);
  assertEquals(list.removeNodeAtTail()?.value, 1);
  assertEquals(list.removeNodeAtTail(), undefined);
});

Deno.test("SinglyLinkedList - removeNodeAt", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtTail(new TestNumberData(1));
  list.addNodeAtTail(new TestNumberData(2));
  list.addNodeAtTail(new TestNumberData(3));
  assertEquals(list.removeNodeAt(1)?.value, 2);
  assertThrows(() => list.removeNodeAt(-1), Error, "Index out of bounds");
  assertThrows(() => list.removeNodeAt(3), Error, "Index out of bounds");
});

Deno.test("SinglyLinkedList - traverse", () => {
  const list = new SinglyLinkedList<TestNumberData>();
  list.addNodeAtTail(new TestNumberData(1));
  list.addNodeAtTail(new TestNumberData(2));
  list.addNodeAtTail(new TestNumberData(3));
  const result: number[] = [];
  let current = list.head;
  while (current !== null) {
    result.push(current.data.value);
    current = current.next;
  }
  assertEquals(result, [1, 2, 3]);
});
