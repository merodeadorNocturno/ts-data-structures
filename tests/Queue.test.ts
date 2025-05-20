import { assert, assertEquals } from "jsr:@std/assert";
import { Queue } from "../structures/Queue.ts";

Deno.test("Queue - enqueue and dequeue", () => {
  const queue = new Queue<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  assertEquals(queue.size(), 2);
  assertEquals(queue.dequeue(), 1);
  assertEquals(queue.dequeue(), 2);
  assertEquals(queue.dequeue(), undefined);
});

Deno.test("Queue - peek", () => {
  const queue = new Queue<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  assertEquals(queue.peek(), 1);
  queue.dequeue();
  assertEquals(queue.peek(), 2);
  queue.dequeue();
  assertEquals(queue.peek(), undefined);
});

Deno.test("Queue - isEmpty", () => {
  const queue = new Queue<number>();
  assert(queue.isEmpty());
  queue.enqueue(1);
  assert(!queue.isEmpty());
  queue.dequeue();
  assert(queue.isEmpty());
});

Deno.test("Queue - toString", () => {
  const queue = new Queue<number>();
  assertEquals(queue.toString(), "");
  queue.enqueue(1);
  queue.enqueue(2);
  assertEquals(queue.toString(), "1->2");
  queue.dequeue();
  assertEquals(queue.toString(), "2");
  queue.dequeue();
  assertEquals(queue.toString(), "");
});
