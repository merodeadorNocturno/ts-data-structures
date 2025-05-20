# Data Structures Library (TypeScript/Deno)

A collection of common data structures implemented in TypeScript, designed to be used with Deno and potentially other JavaScript environments via JSR.

## Installation and Usage

This library is designed to be published on JSR (jsr.io). Once published, you can import it directly in your Deno or Node.js projects.

To use the library, import the desired data structure from the main module:

```typescript
// Example: Importing the Queue
import { Queue } from "jsr:@choco/ts-data-structures";

const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log("Queue:", queue.toString());
console.log("Dequeue:", queue.dequeue());
console.log("Queue after dequeue:", queue.toString());
```


## Included Data Structures

*   Queue (`structures/Queue.ts`)
*   Stack (`structures/Stack.ts`)
*   Singly Linked List (`structures/SinglyLinkedList.ts`)
*   Binary Tree (`structures/BinaryTree.ts`) - Requires data type to implement `Comparable` and have a `fromString` static method (like `utils/NumberWrapper.ts`).
*   Directed Graph (`structures/Graph.ts`) - Requires data type to implement `DataShapeWithValue`.
*   Undirected Graph (`structures/Graph.ts`) - Requires data type to implement `DataShapeWithValue`.

Also includes:
*   `Comparable` interface (`interfaces/Comparable.ts`)
*   `DataShapeWithValue` type (`interfaces/Comparable.ts`)
*   `Node` and `TreeNode` classes (`structures/Nodes.ts`)
*   `NumberWrapper` utility class (`utils/NumberWrapper.ts`) - An example of a type implementing `Comparable` and `DataShapeWithValue`.

## Examples

Here are some basic examples of how to use a few of the data structures:

### Queue Example

```typescript
import { Queue } from "jsr:@choco/ts-data-structures"; // Replace with your actual JSR package name

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
console.log("Queue size:", queue.size());
console.log("Peek:", queue.peek());
console.log("Dequeue:", queue.dequeue());
console.log("Peek after dequeue:", queue.peek());
```

### Stack Example

```typescript
import { Stack } from "jsr:@choco/ts-data-structures"; // Replace with your actual JSR package name

const stack = new Stack<number>();
stack.push(10);
stack.push(20);
console.log("Stack size:", stack.size());
console.log("Peek:", stack.peek());
console.log("Pop:", stack.pop());
console.log("Peek after pop:", stack.peek());
```

### Singly Linked List Example

```typescript
import { SinglyLinkedList, DataShapeWithValue } from "jsr:@choco/ts-data-structures"; // Replace with your actual JSR package name

// Define a simple data type implementing DataShapeWithValue for the example
interface SimpleData extends DataShapeWithValue {
    id: number;
    value: number; // Required by DataShapeWithValue
    name?: string;
}

const list = new SinglyLinkedList<SimpleData>();
list.addNodeAtHead({ id: 1, value: 1, name: "one" });
list.addNodeAtTail({ id: 3, value: 3, name: "three" });
list.insertNodeAt(1, { id: 2, value: 2, name: "two" });

console.log("Linked List:");
let current = list.head;
while (current !== null) {
    console.log(`- Node (Value: ${current.data.value}, Name: ${current.data.name})`);
    current = current.next;
}
// Expected Output:
// Linked List:
// - Node (Value: 1, Name: one)
// - Node (Value: 2, Name: two)
// - Node (Value: 3, Name: three)
```

### Binary Tree Example

```typescript
import { BinaryTree, Comparable, DataShapeWithValue, NumberWrapper } from "jsr:@choco/ts-data-structures"; // Replace with your actual JSR package name

// BinaryTree requires a type that implements Comparable and has a fromString static method.
// NumberWrapper is provided as an example.
const tree = new BinaryTree(new NumberWrapper(10), NumberWrapper as { fromString(s: string): NumberWrapper });

tree.insert(new NumberWrapper(5));
tree.insert(new NumberWrapper(15));
tree.insert(new NumberWrapper(3));

console.log("Binary Tree In-Order Traversal (values):", tree.traverseInOrder().map(node => node.data.value));
console.log("Min value:", tree.findMin()?.value);
console.log("Max value:", tree.findMax()?.value);
console.log("Contains 5:", tree.contains(new NumberWrapper(5)));
console.log("Contains 100:", tree.contains(new NumberWrapper(100)));
```

### Graph Example

```typescript
import { Directed, Unidirected, DataShapeWithValue } from "jsr:@choco/ts-data-structures"; // Replace with your actual JSR package name

// Define a simple data type implementing DataShapeWithValue for the example
interface GraphData extends DataShapeWithValue {
    id: string;
    value: number; // Required by DataShapeWithValue
}

const nodeA: GraphData = { id: "A", value: 10 };
const nodeB: GraphData = { id: "B", value: 20 };
const nodeC: GraphData = { id: "C", value: 30 };

// Directed Graph Example
const directedGraph = new Directed<GraphData>();
directedGraph.addNode(nodeA);
directedGraph.addNode(nodeB);
directedGraph.addNode(nodeC);
directedGraph.addEdge(nodeA, nodeB); // A -> B
directedGraph.addWeightedEdge(nodeA, nodeC, 5); // A -> C with weight 5

console.log("\nDirected Graph BFS from A:");
directedGraph.bfs(nodeA, (data) => console.log(`- Visited node: ${data.id} (Value: ${data.value})`));

// Unidirected Graph Example
const unidirectedGraph = new Unidirected<GraphData>();
unidirectedGraph.addNode(nodeA);
unidirectedGraph.addNode(nodeB);
unidirectedGraph.addNode(nodeC);
unidirectedGraph.addEdge(nodeA, nodeB); // A <-> B
unidirectedGraph.addWeightedEdge(nodeB, nodeC, 10); // B <-> C with weight 10

console.log("\nUnidirected Graph DFS from A:");
unidirectedGraph.dfs(nodeA, (data) => console.log(`- Visited node: ${data.id} (Value: ${data.value})`));
```

## Development

The project uses Deno. You can run the tests using the Deno CLI:

```bash
deno test
```

To format and lint the code:

```bash
deno fmt
deno lint
```

To run the main example file (which will contain the JSR exports):

```bash
deno run main.ts
```

Feel free to contribute by opening issues or pull requests on the project's repository.

```
