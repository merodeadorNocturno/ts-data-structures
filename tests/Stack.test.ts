import { assert, assertEquals } from "jsr:@std/assert";
import { Stack } from "../structures/Stack.ts";

Deno.test("Stack - push and pop", () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  assertEquals(stack.size(), 2);
  assertEquals(stack.pop(), 2);
  assertEquals(stack.pop(), 1);
  assertEquals(stack.pop(), undefined);
});

Deno.test("Stack - peek", () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  assertEquals(stack.peek(), 2);
  stack.pop();
  assertEquals(stack.peek(), 1);
  stack.pop();
  assertEquals(stack.peek(), undefined);
});

Deno.test("Stack - isEmpty", () => {
  const stack = new Stack<number>();
  assert(stack.isEmpty());
  stack.push(1);
  assert(!stack.isEmpty());
  stack.pop();
  assert(stack.isEmpty());
});

Deno.test("Stack - clear", () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.clear();
  assert(stack.isEmpty());
  assertEquals(stack.size(), 0);
});

Deno.test("Stack - toArray", () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  assertEquals(stack.toArray(), [1, 2]);
});
