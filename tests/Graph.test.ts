import { Directed, Unidirected } from "../structures/Graph.ts"; // This should be the first import
import type { DataShapeWithValue } from "../interfaces/Comparable.ts";
import {
  assertEquals,
  assertExists,
  assertArrayIncludes,
} from "jsr:@std/assert";

// Define a sample data type implementing DataShapeWithValue
interface TestData extends DataShapeWithValue {
  id: number;
  name: string;
  // Need to explicitly define compareTo and toString as they are part of Comparable
  compareTo(other: TestData): number;
  toString(): string;
}

// Helper function to create TestData objects
const createTestData = (id: number, value: number, name: string): TestData => ({
  id,
  value, // value property required by DataShapeWithValue
  name,
  compareTo: function (other: TestData): number {
    // Assuming comparison is based on the 'value' property
    return this.value - other.value;
  },
  toString: function (): string {
    return `(${this.id}, ${this.value}, ${this.name})`;
  },
});

// Helper function to spy on console.error calls within a callback
const spyConsoleError = (callback: () => void): string[] => {
  const calls: string[] = [];
  const original = console.error;

  console.error = (...args: unknown[]) => {
    // Join args into a single string for simpler comparison in assertions
    calls.push(
      args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          if (typeof arg === "object" && arg !== null && "value" in arg) {
            return `node with data ${arg.value}`;
          }
          return String(arg);
        })
        .join(" "),
    );
  };

  try {
    callback();
  } finally {
    console.error = original; // Restore original console.error
  }

  return calls;
};

Deno.test("Graph Data Structures", async (t) => {
  let node1: TestData;
  let node2: TestData;
  let node3: TestData;
  let node4: TestData;
  let node5: TestData;

  // This setup will run before each main test step (Common, Directed, Undirected)
  // For 'beforeEach' behavior per inner test step, replicate this logic in each step
  const setupNodes = () => {
    node1 = createTestData(1, 10, "A");
    node2 = createTestData(2, 20, "B");
    node3 = createTestData(3, 30, "C");
    node4 = createTestData(4, 40, "D");
    node5 = createTestData(5, 50, "E");
  };

  await t.step("Common Graph Methods", async (t_common) => {
    setupNodes(); // Setup nodes for this test suite

    await t_common.step("should add nodes correctly", () => {
      const graph = new Directed<TestData>(); // Can test with either Directed or Unidirected
      graph.addNode(node1);
      graph.addNode(node2);
      assertEquals(graph.getNodes().length, 2);
      assertArrayIncludes(graph.getNodes(), [node1]);
      assertArrayIncludes(graph.getNodes(), [node2]);
    });

    await t_common.step("should not add duplicate nodes", () => {
      const graph = new Unidirected<TestData>(); // Can test with either Directed or Unidirected
      graph.addNode(node1);
      graph.addNode(node1); // Add again
      assertEquals(graph.getNodes().length, 1);
    });

    await t_common.step(
      "hasNode should return true for existing nodes and false otherwise",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1);
        assertEquals(graph.hasNode(node1), true);
        assertEquals(graph.hasNode(node2), false);
      },
    );

    await t_common.step(
      "getNeighbors should return undefined for non-existent node",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1);
        assertEquals(graph.getNeighbors(node2), undefined);
      },
    );

    await t_common.step(
      "getNeighbors should return an empty array for a node with no edges",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1);
        assertEquals(graph.getNeighbors(node1), []);
      },
    );
  });

  await t.step("Directed Graph", async (t_directed) => {
    setupNodes(); // Setup nodes for this test suite

    await t_directed.step(
      "should add unweighted directed edges correctly",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(node1, node2);

        const node1Neighbors = graph.getNeighbors(node1);
        assertExists(node1Neighbors); // Ensure neighbors array exists
        assertEquals(node1Neighbors.length, 1);
        assertEquals(node1Neighbors[0].target, node2);
        assertEquals(node1Neighbors![0].weight, undefined);

        const node2Neighbors = graph.getNeighbors(node2);
        assertEquals(node2Neighbors, []); // No incoming edge in directed graph
      },
    );

    await t_directed.step(
      "should add weighted directed edges correctly",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addWeightedEdge(node1, node2, 5);

        const node1Neighbors = graph.getNeighbors(node1);
        assertExists(node1Neighbors);
        assertEquals(node1Neighbors.length, 1);
        assertEquals(node1Neighbors[0].target, node2);
        assertEquals(node1Neighbors[0].weight, 5);

        const node2Neighbors = graph.getNeighbors(node2);
        assertEquals(node2Neighbors, []);
      },
    );

    await t_directed.step(
      "should not add edge if source or target node does not exist",
      () => {
        const graph = new Directed<TestData>();
        graph.addNode(node1); // node2 does not exist
        graph.addEdge(node1, node2);
        assertEquals(graph.getNeighbors(node1), []);

        graph.addNode(node2); // node1 exists, node3 does not
        graph.addWeightedEdge(node1, node3, 10);
        assertEquals(graph.getNeighbors(node1), []); // Still 0 from previous failed add
      },
    );
  });

  await t.step("Unidirected Graph", async (t_unidirected) => {
    setupNodes(); // Setup nodes for this test suite

    await t_unidirected.step(
      "should add unweighted unidirected edges correctly",
      () => {
        const graph = new Unidirected<TestData>();
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(node1, node2);

        const node1Neighbors = graph.getNeighbors(node1);
        assertExists(node1Neighbors);
        assertEquals(node1Neighbors.length, 1);
        assertEquals(node1Neighbors[0].target, node2);
        assertEquals(node1Neighbors[0].weight, undefined);

        const node2Neighbors = graph.getNeighbors(node2);
        assertExists(node2Neighbors);
        assertEquals(node2Neighbors.length, 1); // Incoming edge exists
        assertEquals(node2Neighbors[0].target, node1);
        assertEquals(node2Neighbors[0].weight, undefined);
      },
    );

    await t_unidirected.step(
      "should add weighted unidirected edges correctly",
      () => {
        const graph = new Unidirected<TestData>();
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addWeightedEdge(node1, node2, 5);

        const node1Neighbors = graph.getNeighbors(node1);
        assertExists(node1Neighbors);
        assertEquals(node1Neighbors.length, 1);
        assertEquals(node1Neighbors[0].target, node2);
        assertEquals(node1Neighbors[0].weight, 5);

        const node2Neighbors = graph.getNeighbors(node2);
        assertExists(node2Neighbors);
        assertEquals(node2Neighbors.length, 1); // Incoming weighted edge exists
        assertEquals(node2Neighbors[0].target, node1);
        assertEquals(node2Neighbors[0].weight, 5); // Weight is the same in both directions
      },
    );

    await t_unidirected.step(
      "should not add edge if source or target node does not exist",
      () => {
        const graph = new Unidirected<TestData>();
        graph.addNode(node1); // node2 does not exist
        graph.addEdge(node1, node2);
        assertEquals(graph.getNeighbors(node1), []);

        graph.addNode(node2); // node1 exists, node3 does not
        graph.addWeightedEdge(node1, node3, 10);
        assertEquals(graph.getNeighbors(node1), []); // Still 0 from previous failed add
      },
    );

    await t_unidirected.step(
      "Traversal Methods (BFS/DFS)",
      async (t_traversal) => {
        setupNodes(); // Setup nodes for this test suite

        let graph: Unidirected<TestData>;
        let visitedOrder: TestData[];

        // Setup for traversal tests
        const setupTraversalGraph = () => {
          graph = new Unidirected<TestData>();
          visitedOrder = [];

          // Build a sample graph for traversal
          graph.addNode(node1); // A (10)
          graph.addNode(node2); // B (20)
          graph.addNode(node3); // C (30)
          graph.addNode(node4); // D (40)
          graph.addNode(node5); // E (50)

          graph.addEdge(node1, node2); // A <-> B
          graph.addEdge(node1, node3); // A <-> C
          graph.addEdge(node2, node4); // B <-> D
          graph.addEdge(node3, node4); // C <-> D
          graph.addEdge(node4, node5); // D <-> E

          // Graph Structure:
          // A -- B -- D -- E
          // |    |
          // C ---|
        };

        await t_traversal.step("should perform BFS correctly", () => {
          setupTraversalGraph(); // Setup graph for this test

          // Expected BFS order starting from node1 (A):
          // A (10) -> Neighbors (B, C) -> B's Neighbor (D, excluding A) -> C's Neighbor (D, already visited) -> D's Neighbor (E, excluding B, C)
          // Possible orders depending on adjacency list iteration order for neighbors:
          // A, B, C, D, E
          // A, C, B, D, E

          graph.bfs(node1, (data) => visitedOrder.push(data));

          // Check if all nodes are visited and the order is valid for BFS
          assertEquals(visitedOrder.length, 5);
          assertEquals(visitedOrder[0].value, 10); // A
          // Check if B and C are the next two visited nodes (order between B and C might vary)
          const secondAndThird = visitedOrder.slice(1, 3);
          assertArrayIncludes(
            secondAndThird.map((n) => n.value),
            [20, 30],
          ); // Check values
          assertArrayIncludes(secondAndThird, [node2, node3]); // Check object equality/structure

          assertEquals(visitedOrder[3].value, 40); // D (should be visited after B and C)
          assertEquals(visitedOrder[4].value, 50); // E (should be visited after D)
        });

        await t_traversal.step(
          "should perform DFS correctly (iterative)",
          () => {
            setupTraversalGraph(); // Setup graph for this test

            // Expected DFS order starting from node1 (A) with current implementation (pushing neighbors 0..N-1):
            // A -> C -> D -> E -> B
            graph.dfs(node1, (data) => visitedOrder.push(data));

            // Check if all nodes are visited and the order matches the actual iterative DFS order
            assertEquals(visitedOrder.length, 5);
            assertEquals(visitedOrder[0].value, 10); // A
            assertEquals(visitedOrder[1].value, 30); // C
            assertEquals(visitedOrder[2].value, 40); // D
            assertEquals(visitedOrder[3].value, 50); // E
            assertEquals(visitedOrder[4].value, 20); // B
          },
        );

        await t_traversal.step("BFS should handle start node not found", () => {
          const visitedOrder: TestData[] = []; // Local visitedOrder for this test
          const nonExistentNode = createTestData(99, 999, "NonExistent");

          const consoleErrorCalls = spyConsoleError(() => {
            const emptyGraph = new Directed<TestData>();
            emptyGraph.bfs(nonExistentNode, (data) => visitedOrder.push(data));
          });

          // Assertions for console.error call
          assertEquals(consoleErrorCalls.length, 1);
          assertEquals(
            consoleErrorCalls[0],
            `BFS failed: Start node with data 999 not found.`,
          );

          // Assert no nodes were visited
          assertEquals(visitedOrder.length, 0);
        });

        await t_traversal.step("DFS should handle start node not found", () => {
          const visitedOrder: TestData[] = []; // Local visitedOrder for this test
          const nonExistentNode = createTestData(99, 999, "NonExistent");

          const consoleErrorCalls = spyConsoleError(() => {
            const emptyGraph = new Unidirected<TestData>();
            emptyGraph.dfs(nonExistentNode, (data) => visitedOrder.push(data));
          });

          // Assertions for console.error call
          assertEquals(consoleErrorCalls.length, 1);
          assertEquals(
            consoleErrorCalls[0],
            `DFS failed: Start node with data 999 not found.`,
          );

          // Assert no nodes were visited
          assertEquals(visitedOrder.length, 0);
        });
      },
    );

    await t_unidirected.step(
      "Traversal Methods (BFS/DFS)",
      async (t_traversal) => {
        setupNodes(); // Setup nodes for this test suite

        let graph: Unidirected<TestData>;
        let visitedOrder: TestData[];

        // Setup for traversal tests
        const setupTraversalGraph = () => {
          graph = new Unidirected<TestData>();
          visitedOrder = [];

          // Build a sample graph for traversal
          graph.addNode(node1); // A (10)
          graph.addNode(node2); // B (20)
          graph.addNode(node3); // C (30)
          graph.addNode(node4); // D (40)
          graph.addNode(node5); // E (50)

          graph.addEdge(node1, node2); // A <-> B
          graph.addEdge(node1, node3); // A <-> C
          graph.addEdge(node2, node4); // B <-> D
          graph.addEdge(node3, node4); // C <-> D
          graph.addEdge(node4, node5); // D <-> E

          // Graph Structure:
          // A -- B -- D -- E
          // |    |
          // C ---|
        };

        await t_traversal.step("should perform BFS correctly", () => {
          setupTraversalGraph(); // Setup graph for this test

          // Expected BFS order starting from node1 (A):
          // A (10) -> Neighbors (B, C) -> B's Neighbor (D, excluding A) -> C's Neighbor (D, already visited) -> D's Neighbor (E, excluding B, C)
          // Possible orders depending on adjacency list iteration order for neighbors:
          // A, B, C, D, E
          // A, C, B, D, E

          graph.bfs(node1, (data) => visitedOrder.push(data));

          // Check if all nodes are visited and the order is valid for BFS
          assertEquals(visitedOrder.length, 5);
          assertEquals(visitedOrder[0].value, 10); // A
          // Check if B and C are the next two visited nodes (order between B and C might vary)
          const secondAndThird = visitedOrder.slice(1, 3);
          assertArrayIncludes(
            secondAndThird.map((n) => n.value),
            [20, 30],
          ); // Check values
          assertArrayIncludes(secondAndThird, [node2, node3]); // Check object equality/structure

          assertEquals(visitedOrder[3].value, 40); // D (should be visited after B and C)
          assertEquals(visitedOrder[4].value, 50); // E (should be visited after D)
        });

        await t_traversal.step(
          "should perform DFS correctly (iterative)",
          () => {
            setupTraversalGraph(); // Setup graph for this test

            // Expected DFS order starting from node1 (A) with current implementation (pushing neighbors 0..N-1):
            // A -> C -> D -> E -> B
            graph.dfs(node1, (data) => visitedOrder.push(data));

            // Check if all nodes are visited and the order matches the actual iterative DFS order
            assertEquals(visitedOrder.length, 5);
            assertEquals(visitedOrder[0].value, 10); // A
            assertEquals(visitedOrder[1].value, 30); // C
            assertEquals(visitedOrder[2].value, 40); // D
            assertEquals(visitedOrder[3].value, 50); // E
            assertEquals(visitedOrder[4].value, 20); // B
          },
        );

        await t_traversal.step("BFS should handle start node not found", () => {
          const visitedOrder: TestData[] = []; // Local visitedOrder for this test
          const nonExistentNode = createTestData(99, 999, "NonExistent");

          const consoleErrorCalls = spyConsoleError(() => {
            const emptyGraph = new Directed<TestData>();
            emptyGraph.bfs(nonExistentNode, (data) => visitedOrder.push(data));
          });

          // Assertions for console.error call
          assertEquals(consoleErrorCalls.length, 1);
          assertEquals(
            consoleErrorCalls[0],
            `BFS failed: Start node with data 999 not found.`,
          );

          // Assert no nodes were visited
          assertEquals(visitedOrder.length, 0);
        });

        await t_traversal.step("DFS should handle start node not found", () => {
          const visitedOrder: TestData[] = []; // Local visitedOrder for this test
          const nonExistentNode = createTestData(99, 999, "NonExistent");

          const consoleErrorCalls = spyConsoleError(() => {
            const emptyGraph = new Unidirected<TestData>();
            emptyGraph.dfs(nonExistentNode, (data) => visitedOrder.push(data));
          });

          // Assertions for console.error call
          assertEquals(consoleErrorCalls.length, 1);
          assertEquals(
            consoleErrorCalls[0],
            `DFS failed: Start node with data 999 not found.`,
          );

          // Assert no nodes were visited
          assertEquals(visitedOrder.length, 0);
        });
      },
    );
  });

  await t.step("Dijkstra's Algorithm", async (t_dijkstra) => {
    setupNodes(); // Setup nodes for this test suite

    await t_dijkstra.step(
      "should find shortest paths in a simple weighted unidirected graph",
      () => {
        const graph = new Unidirected<TestData>();

        // Nodes A, B, C, D, E
        graph.addNode(node1); // A (10)
        graph.addNode(node2); // B (20)
        graph.addNode(node3); // C (30)
        graph.addNode(node4); // D (40)
        graph.addNode(node5); // E (50)

        // Edges with weights:
        // A-B (4), A-C (2)
        // B-E (3), B-D (2)
        // C-D (4), C-E (5)
        // D-E (1)

        graph.addWeightedEdge(node1, node2, 4); // A-B
        graph.addWeightedEdge(node1, node3, 2); // A-C
        graph.addWeightedEdge(node2, node5, 3); // B-E
        graph.addWeightedEdge(node2, node4, 2); // B-D
        graph.addWeightedEdge(node3, node4, 4); // C-D
        graph.addWeightedEdge(node3, node5, 5); // C-E
        graph.addWeightedEdge(node4, node5, 1); // D-E

        // Expected shortest paths from A (node1):
        // A -> A: 0
        // A -> C: 2 (A-C)
        // A -> B: 4 (A-B)
        // A -> D: min(A-B-D [4+2=6], A-C-D [2+4=6]) = 6
        // A -> E: min(A-B-D-E [4+2+1=7], A-C-D-E [2+4+1=7], A-B-E [4+3=7], A-C-E [2+5=7]) = 7

        const { distances, predecessors } = graph.dijkstra(node1);

        assertEquals(distances.get(node1.value), 0);
        assertEquals(distances.get(node2.value), 4);
        assertEquals(distances.get(node3.value), 2);
        assertEquals(distances.get(node4.value), 6);
        assertEquals(distances.get(node5.value), 7);

        assertEquals(predecessors.get(node1.value), null);
        assertEquals(predecessors.get(node2.value), node1); // A -> B is shortest path to B
        assertEquals(predecessors.get(node3.value), node1); // A -> C is shortest path to C
        // Predecessor for D could be B or C depending on iteration order for equal cost paths.
        assertArrayIncludes([node2, node3], [predecessors.get(node4.value)!]);
        assertArrayIncludes(
          [node2, node3, node4],
          [predecessors.get(node5.value)!],
        ); // Shortest path to E could be via B, C, or D with minimal distance 7
      },
    );

    await t_dijkstra.step(
      "should find shortest paths in a simple weighted directed graph",
      () => {
        const graph = new Directed<TestData>();

        // Nodes A, B, C, D, E
        graph.addNode(node1); // A (10)
        graph.addNode(node2); // B (20)
        graph.addNode(node3); // C (30)
        graph.addNode(node4); // D (40)
        graph.addNode(node5); // E (50)

        // Directed Edges with weights:
        // A -> B (4), A -> C (2)
        // B -> E (3), B -> D (2)
        // C -> D (4), C -> E (5)
        // D -> E (1)
        // E -> B (10) - added to test unreachable path back to B from E

        graph.addWeightedEdge(node1, node2, 4); // A -> B
        graph.addWeightedEdge(node1, node3, 2); // A -> C
        graph.addWeightedEdge(node2, node5, 3); // B -> E
        graph.addWeightedEdge(node2, node4, 2); // B -> D
        graph.addWeightedEdge(node3, node4, 4); // C -> D
        graph.addWeightedEdge(node3, node5, 5); // C -> E
        graph.addWeightedEdge(node4, node5, 1); // D -> E
        graph.addWeightedEdge(node5, node2, 10); // E -> B

        // Expected shortest paths from A (node1):
        // A -> A: 0
        // A -> C: 2 (A->C)
        // A -> B: 4 (A->B)
        // A -> D: min(A->B->D [4+2=6], A->C->D [2+4=6]) = 6
        // A -> E: min(A->B->D->E [4+2+1=7], A->C->D->E [2+4+1=7], A->B->E [4+3=7], A->C->E [2+5=7]) = 7

        const { distances, predecessors } = graph.dijkstra(node1);

        assertEquals(distances.get(node1.value), 0);
        assertEquals(distances.get(node2.value), 4);
        assertEquals(distances.get(node3.value), 2);
        assertEquals(distances.get(node4.value), 6);
        assertEquals(distances.get(node5.value), 7);

        assertEquals(predecessors.get(node1.value), null);
        assertEquals(predecessors.get(node2.value), node1); // A -> B is shortest path to B
        assertEquals(predecessors.get(node3.value), node1); // A -> C is shortest path to C
        // Predecessor for D could be B or C depending on iteration order for equal cost paths.
        assertArrayIncludes([node2, node3], [predecessors.get(node4.value)!]);
        assertArrayIncludes(
          [node2, node3, node4],
          [predecessors.get(node5.value)!],
        ); // Shortest path to E could be via B, C, or D with minimal distance 7
      },
    );

    await t_dijkstra.step("should handle unreachable nodes", () => {
      const graph = new Directed<TestData>();

      // Nodes A, B, C
      graph.addNode(node1); // A (10)
      graph.addNode(node2); // B (20)
      graph.addNode(node3); // C (30)
      graph.addNode(node4); // D (40) - Unreachable

      // Edges: A -> B (1), C -> B (1)
      graph.addWeightedEdge(node1, node2, 1);
      graph.addWeightedEdge(node3, node2, 1);

      // Start from A
      const { distances: distA } = graph.dijkstra(node1);
      assertEquals(distA.get(node1.value), 0);
      assertEquals(distA.get(node2.value), 1);
      assertEquals(distA.get(node3.value), Infinity); // C is unreachable from A
      assertEquals(distA.get(node4.value), Infinity); // D is unreachable from A

      // Start from C
      const { distances: distC } = graph.dijkstra(node3);
      assertEquals(distC.get(node1.value), Infinity); // A is unreachable from C
      assertEquals(distC.get(node2.value), 1);
      assertEquals(distC.get(node3.value), 0);
      assertEquals(distC.get(node4.value), Infinity); // D is unreachable from C
    });

    await t_dijkstra.step("should handle start node not found", () => {
      const nonExistentNode = createTestData(99, 999, "NonExistent");

      const consoleErrorCalls = spyConsoleError(() => {
        const emptyGraph = new Directed<TestData>();
        const { distances, predecessors } =
          emptyGraph.dijkstra(nonExistentNode);

        // Assert empty maps are returned
        assertEquals(distances.size, 0);
        assertEquals(predecessors.size, 0);
      });

      // Assertions for console.error call
      assertEquals(consoleErrorCalls.length, 1);
      assertEquals(
        consoleErrorCalls[0],
        `Dijkstra failed: Start node with data 999 not found.`,
      );
    });

    await t_dijkstra.step("should handle graphs with negative weights", () => {
      const graph = new Directed<TestData>();
      graph.addNode(node1); // A (10)
      graph.addNode(node2); // B (20)

      // Add an edge with a negative weight
      graph.addWeightedEdge(node1, node2, -5);

      const consoleErrorCalls = spyConsoleError(() => {
        const { distances, predecessors } = graph.dijkstra(node1);

        // Assert empty maps are returned
        assertEquals(distances.size, 0);
        assertEquals(predecessors.size, 0);
      });

      // Assertions for console.error call
      assertEquals(consoleErrorCalls.length, 1);
      assertEquals(
        consoleErrorCalls[0],
        `Dijkstra requires non-negative edge weights. Found negative weight.`,
      );
    });
  });
});
