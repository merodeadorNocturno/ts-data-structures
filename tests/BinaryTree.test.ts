import { assertEquals, assert } from "jsr:@std/assert";
import { BinaryTree } from "../structures/BinaryTree.ts";
import { NumberWrapper } from "../utils/NumberWrapper.ts";

Deno.test("BinaryTree insert and traverseInOrder", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  const result = tree.traverseInOrder().map((node) => node.data.value);

  assertEquals(result, [3, 5, 7, 10, 12, 15, 18]);
});

Deno.test("BinaryTree findMin and findMax", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  assertEquals(tree.findMin()?.value, 3);
  assertEquals(tree.findMax()?.value, 18);
});

Deno.test("BinaryTree contains", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));

  assert(tree.contains(new NumberWrapper(10)));
  assert(tree.contains(new NumberWrapper(5)));
  assert(tree.contains(new NumberWrapper(15)));
  assert(!tree.contains(new NumberWrapper(20)));
});

Deno.test("BinaryTree height", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  assertEquals(tree.height(), 2);
});

Deno.test("BinaryTree isBalanced", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  assert(tree.isBalanced());
});

Deno.test("BinaryTree countNodes", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  assertEquals(tree.countNodes(), 7);
});

Deno.test("BinaryTree bfs", () => {
  const tree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  tree.insert(new NumberWrapper(5));
  tree.insert(new NumberWrapper(15));
  tree.insert(new NumberWrapper(3));
  tree.insert(new NumberWrapper(7));
  tree.insert(new NumberWrapper(12));
  tree.insert(new NumberWrapper(18));

  const serialized = tree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  newTree.deserialize(serialized);

  const result = newTree.traverseInOrder().map((node) => node.data.value);
  console.log(result, serialized);

  assertEquals(result, [3, 5, 7, 10, 12, 15, 18]);
});

Deno.test("BinaryTree serialize and deserialize - balanced tree", () => {
  const originalTree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  originalTree.insert(new NumberWrapper(5));
  originalTree.insert(new NumberWrapper(15));
  originalTree.insert(new NumberWrapper(3));
  originalTree.insert(new NumberWrapper(7));
  originalTree.insert(new NumberWrapper(12));
  originalTree.insert(new NumberWrapper(18));

  const serialized = originalTree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  ); // Dummy root, will be overwritten
  newTree.deserialize(serialized);

  const originalInOrder = originalTree
    .traverseInOrder()
    .map((node) => node.data.value);
  const newTreeInOrder = newTree
    .traverseInOrder()
    .map((node) => node.data.value);

  assertEquals(
    newTreeInOrder,
    originalInOrder,
    "Deserialized tree in-order traversal should match original",
  );
});

Deno.test("BinaryTree serialize and deserialize - small tree", () => {
  const originalTree = new BinaryTree(
    new NumberWrapper(5),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  originalTree.insert(new NumberWrapper(3));
  originalTree.insert(new NumberWrapper(7));

  const serialized = originalTree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  ); // Dummy root
  newTree.deserialize(serialized);

  const originalInOrder = originalTree
    .traverseInOrder()
    .map((node) => node.data.value);
  const newTreeInOrder = newTree
    .traverseInOrder()
    .map((node) => node.data.value);

  assertEquals(
    newTreeInOrder,
    originalInOrder,
    "Deserialized small tree in-order traversal should match",
  );
});

Deno.test("BinaryTree serialize and deserialize - left skewed tree", () => {
  const originalTree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  originalTree.insert(new NumberWrapper(9));
  originalTree.insert(new NumberWrapper(8));
  originalTree.insert(new NumberWrapper(7));

  const serialized = originalTree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  ); // Dummy root
  newTree.deserialize(serialized);

  const originalInOrder = originalTree
    .traverseInOrder()
    .map((node) => node.data.value);
  const newTreeInOrder = newTree
    .traverseInOrder()
    .map((node) => node.data.value);

  assertEquals(
    newTreeInOrder,
    originalInOrder,
    "Deserialized left-skewed tree in-order traversal should match",
  );
});

Deno.test("BinaryTree serialize and deserialize - right skewed tree", () => {
  const originalTree = new BinaryTree(
    new NumberWrapper(10),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );
  originalTree.insert(new NumberWrapper(11));
  originalTree.insert(new NumberWrapper(12));
  originalTree.insert(new NumberWrapper(13));

  const serialized = originalTree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  ); // Dummy root
  newTree.deserialize(serialized);

  const originalInOrder = originalTree
    .traverseInOrder()
    .map((node) => node.data.value);
  const newTreeInOrder = newTree
    .traverseInOrder()
    .map((node) => node.data.value);

  assertEquals(
    newTreeInOrder,
    originalInOrder,
    "Deserialized right-skewed tree in-order traversal should match",
  );
});

Deno.test("BinaryTree serialize and deserialize - single node tree", () => {
  const originalTree = new BinaryTree(
    new NumberWrapper(42),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  );

  const serialized = originalTree.serialize();
  const newTree = new BinaryTree(
    new NumberWrapper(0),
    NumberWrapper as { fromString(s: string): NumberWrapper },
  ); // Dummy root
  newTree.deserialize(serialized);

  const originalInOrder = originalTree
    .traverseInOrder()
    .map((node) => node.data.value);
  const newTreeInOrder = newTree
    .traverseInOrder()
    .map((node) => node.data.value);

  assertEquals(
    newTreeInOrder,
    originalInOrder,
    "Deserialized single node tree in-order traversal should match",
  );
});
