/**
 * This module provides implementations for Directed and Unidirected Graphs.
 * Graphs require node data to implement the `DataShapeWithValue` interface.
 * @module
 */
import type { DataShapeWithValue } from "../interfaces/Comparable.ts";

/**
 * Represents an edge connecting two nodes in a graph.
 * An edge can optionally have a weight.
 */
class GraphEdge<T extends DataShapeWithValue> {
  /**
   * @param target The data of the target node of this edge.
   * @param weight Optional weight associated with the edge.
   */
  constructor(
    public target: T,
    public weight?: number,
  ) {}
}

/**
 * Provides common methods and properties for graph implementations (Directed and Unidirected).
 * It manages the nodes and the adjacency list.
 */
export class CommonGraphMethods<T extends DataShapeWithValue> {
  /**
   * Use a Map for adjacency list: maps source node data to a list of outgoing edges.
   * The key is the source node's data, and the value is an array of `GraphEdge` objects.
   */
  protected adjacencyList: Map<T, GraphEdge<T>[]>;
  /**
   * A map to quickly look up node data by its value.
   */
  protected nodeMap: Map<number, T>;
  /**
   * Keep track of all nodes added to the graph.
   */
  protected nodes: T[];

  /**
   * Constructs a new CommonGraphMethods instance, initializing the adjacency list and nodes array.
   */
  constructor() {
    this.adjacencyList = new Map();
    this.nodeMap = new Map();
    this.nodes = [];
  }

  /**
   * Adds a node to the graph if it doesn't already exist.
   * @param data The data for the new node. Must implement `DataShapeWithValue`.
   */
  addNode(data: T): void {
    // Use JSON.stringify for reliable Map key comparison with objects,
    // or rely on object reference equality if T objects are reused.
    // Let's assume object reference equality or unique data values for simplicity here.
    if (!this.adjacencyList.has(data)) {
      this.adjacencyList.set(data, []);
      this.nodeMap.set(data.value, data); // Map value to node object
      this.nodes.push(data);
      // console.log(`Added node with data: ${data.value}`); // Assuming T has a value property - disable for cleaner output
    } else {
      // console.log(`Node with data: ${data.value} already exists.`); // disable for cleaner output
    }
  }

  /**
   * Checks if a node with the given data exists in the graph.
   * @param data The data of the node to check for existence. Must implement `DataShapeWithValue`.
   * @returns true if the node exists, false otherwise.
   */
  hasNode(data: T): boolean {
    return this.adjacencyList.has(data);
  }

  /**
   * Gets all nodes currently in the graph.
   * @returns An array containing the data of all nodes in the graph.
   */
  getNodes(): T[] {
    return this.nodes;
  }

  /**
   * Gets the outgoing edges (neighbors) for a given node.
   * @param data The data of the source node. Must implement `DataShapeWithValue`.
   * @returns An array of `GraphEdge` objects representing the outgoing edges, or `undefined` if the node is not found.
   */
  getNeighbors(data: T): GraphEdge<T>[] | undefined {
    return this.adjacencyList.get(data);
  }

  // addEdge and addWeightedEdge implementations differ for directed/undirected,
  // so they are defined in the respective subclasses.

  /**
   * Performs a Breadth-First Search (BFS) traversal starting from a given node.
   * Visits nodes layer by layer.
   * @param startNodeData The data of the node to start the traversal from. Must implement `DataShapeWithValue`.
   * @param processNode A callback function to execute on the data of each visited node.
   */
  bfs(startNodeData: T, processNode: (data: T) => void): void {
    if (!this.hasNode(startNodeData)) {
      console.error(
        `BFS failed: Start node with data ${startNodeData.value} not found.`,
      );
      return;
    }

    const visited: Set<number> = new Set();
    const queue: T[] = []; // Using a simple array as a queue

    // Start BFS from the given node
    queue.push(startNodeData);
    visited.add(startNodeData.value);

    while (queue.length > 0) {
      // Dequeue the next node data
      const currentNodeData = queue.shift()!; // Use non-null assertion as we check queue.length

      // Process the current node
      processNode(currentNodeData);

      // Get neighbors and enqueue unvisited ones
      const neighbors = this.getNeighbors(currentNodeData);
      if (neighbors) {
        for (const edge of neighbors) {
          const neighborData = edge.target;
          // Check if the neighbor has been visited using its value property
          if (!visited.has(neighborData.value)) {
            // Mark as visited *before* enqueuing
            visited.add(neighborData.value);
            // Enqueue the neighbor\'s data
            queue.push(neighborData);
          }
        }
      }
    }
  }

  /**
   * Performs a Depth-First Search (DFS) traversal starting from a given node.
   * Visits nodes by exploring as far as possible along each branch before backtracking.
   * @param startNodeData The data of the node to start the traversal from. Must implement `DataShapeWithValue`.
   * @param processNode A callback function to execute on the data of each visited node.
   */
  dfs(startNodeData: T, processNode: (data: T) => void): void {
    if (!this.hasNode(startNodeData)) {
      console.error(
        `DFS failed: Start node with data ${startNodeData.value} not found.`,
      );
      return;
    }

    const visited: Set<number> = new Set();
    const stack: T[] = []; // Using a simple array as a stack

    // Start DFS from the given node
    stack.push(startNodeData);

    while (stack.length > 0) {
      // Pop the next node data
      const currentNodeData = stack.pop()!; // Use non-null assertion as we check stack.length

      // Check if the node has been visited using its value property
      if (!visited.has(currentNodeData.value)) {
        // Mark as visited *before* processing
        visited.add(currentNodeData.value);

        // Process the current node
        processNode(currentNodeData);

        // Get neighbors and push unvisited ones onto the stack
        // Iterate forwards to push in the order neighbors appear in the adjacency list,
        // which results in processing in reverse order from the stack.
        const neighbors = this.getNeighbors(currentNodeData);
        if (neighbors) {
          for (let i = 0; i < neighbors.length; i++) {
            const neighborEdge = neighbors[i];
            const neighborData = neighborEdge.target;
            if (!visited.has(neighborData.value)) {
              stack.push(neighborData);
            }
          }
        }
      }
    }
  }

  /**
   * Implements Dijkstra's algorithm to find the shortest paths from a start node
   * to all other reachable nodes in the graph.
   * This implementation uses a simple linear scan to find the minimum distance node,
   * which is suitable for smaller graphs. For larger graphs, a priority queue
   * would significantly improve performance.
   * Edges must have non-negative weights.
   *
   * @param startNodeData The data of the node to start the algorithm from. Must implement `DataShapeWithValue`.
   * @returns A tuple containing:
   *          - distances: A Map where keys are node data (T) and values are the shortest distance from the start node. Infinity if unreachable.
   *          - predecessors: A Map where keys are node data (T) and values are the predecessor node data (T) on the shortest path from the start node, or null for the start node.
   */
  dijkstra(startNodeData: T): {
    distances: Map<number, number>;
    predecessors: Map<number, T | null>;
  } {
    // Check if the start node exists in the graph
    if (!this.hasNode(startNodeData)) {
      console.error(
        `Dijkstra failed: Start node with data ${startNodeData.value} not found.`,
      );
      // Return empty results or throw an error
      return { distances: new Map(), predecessors: new Map() };
    }

    const distances: Map<number, number> = new Map();
    const predecessors: Map<number, T | null> = new Map();
    // Using a Set for unvisited node values for easy deletion
    const unvisited: Set<number> = new Set(
      this.nodes.map((node) => node.value),
    ); // Initialize with all node values

    // Initialize distances and predecessors
    for (const node of this.nodes) {
      distances.set(node.value, Infinity);
      predecessors.set(node.value, null);
    }

    // Distance from start node to itself is 0
    distances.set(startNodeData.value, 0);

    // Process nodes while there are unvisited nodes
    while (unvisited.size > 0) {
      // Find the unvisited node value with the smallest distance
      let currentNodeValue: number | null = null;
      let minDistance = Infinity;

      // Simple linear scan for minimum distance (replace with Priority Queue for large graphs)
      for (const nodeValue of unvisited) {
        if (distances.get(nodeValue)! < minDistance) {
          minDistance = distances.get(nodeValue)!;
          currentNodeValue = nodeValue;
        }
      }

      // If the minimum distance is Infinity, all remaining unvisited nodes are unreachable
      if (currentNodeValue === null || minDistance === Infinity) {
        break;
      }

      // Remove the current node value from the unvisited set
      unvisited.delete(currentNodeValue);

      // Get the actual node object to find neighbors
      const currentNode = this.nodeMap.get(currentNodeValue)!;

      // Update distances of neighbors
      const neighbors = this.getNeighbors(currentNode);
      if (neighbors) {
        for (const edge of neighbors) {
          const neighbor = edge.target;
          const weight = edge.weight ?? 1; // Assume weight is 1 if not specified (for unweighted graph behavior)

          // Check for negative weights (Dijkstra requires non-negative weights)
          if (weight < 0) {
            console.error(
              "Dijkstra requires non-negative edge weights. Found negative weight.",
            );
            // Depending on requirements, you might want to return null, throw error, or return current state
            return { distances: new Map(), predecessors: new Map() }; // Abort or handle appropriately
          }

          // Only consider unvisited neighbors
          if (unvisited.has(neighbor.value)) {
            const newDistance = distances.get(currentNode.value)! + weight;

            // If a shorter path to the neighbor is found
            if (newDistance < distances.get(neighbor.value)!) {
              distances.set(neighbor.value, newDistance);
              predecessors.set(neighbor.value, currentNode);
            }
          }
        }
      }
    }

    return { distances, predecessors };
  }
}

/**
 * Represents a Directed Graph (Digraph).
 * Edges in a directed graph have a specific direction from a source node to a target node.
 * Node data must implement the `DataShapeWithValue` interface.
 */
export class Directed<
  T extends DataShapeWithValue,
> extends CommonGraphMethods<T> {
  /**
   * Constructs a new Directed Graph.
   */
  constructor() {
    super();
    console.log("Created a Directed Graph");
  }

  /**
   * Adds an unweighted directed edge from one node to another.
   * The edge goes from the `from` node to the `to` node.
   * Nodes must already exist in the graph.
   * @param from The data of the source node. Must implement `DataShapeWithValue`.
   * @param to The data of the target node. Must implement `DataShapeWithValue`.
   */
  addEdge(from: T, to: T): void {
    // Ensure both nodes exist before adding edge
    if (!this.hasNode(from) || !this.hasNode(to)) {
      console.error(
        `Cannot add directed edge: Source (${from.value}) or target (${to.value}) node not found.`,
      );
      return;
    }

    // Add edge from 'from' to 'to' in the adjacency list
    this.adjacencyList.get(from)!.push(new GraphEdge(to));
    console.log(`Added directed edge from ${from.value} to ${to.value}`);
  }

  /**
   * Adds a weighted directed edge from one node to another.
   * The edge goes from the `from` node to the `to` node with the specified weight.
   * Nodes must already exist in the graph.
   * @param from The data of the source node. Must implement `DataShapeWithValue`.
   * @param to The data of the target node. Must implement `DataShapeWithValue`.
   * @param weight The weight of the edge.
   */
  addWeightedEdge(from: T, to: T, weight: number): void {
    // Ensure both nodes exist before adding edge
    if (!this.hasNode(from) || !this.hasNode(to)) {
      console.error(
        `Cannot add directed weighted edge: Source (${from.value}) or target (${to.value}) node not found.`,
      );
      return;
    }

    // Add weighted edge from 'from' to 'to' in the adjacency list
    this.adjacencyList.get(from)!.push(new GraphEdge(to, weight));
    console.log(
      `Added directed weighted edge from ${from.value} to ${to.value} with weight ${weight}`,
    );
  }
}

/**
 * Represents an Unidirected Graph.
 * Edges in an unidirected graph connect two nodes symmetrically, implying traversal is possible in both directions.
 * Node data must implement the `DataShapeWithValue` interface.
 */
export class Unidirected<
  T extends DataShapeWithValue,
> extends CommonGraphMethods<T> {
  /**
   * Constructs a new Unidirected Graph.
   */
  constructor() {
    super();
    console.log("Created an Unidirected Graph");
  }

  /**
   * Adds an unweighted unidirected edge between two nodes.
   * This creates symmetric edges in the adjacency list (from `from` to `to`, and from `to` to `from`).
   * Nodes must already exist in the graph.
   * @param from The data of one node involved in the edge. Must implement `DataShapeWithValue`.
   * @param to The data of the other node involved in the edge. Must implement `DataShapeWithValue`.
   */
  addEdge(from: T, to: T): void {
    // Ensure both nodes exist before adding edge
    if (!this.hasNode(from) || !this.hasNode(to)) {
      console.error(
        `Cannot add unidirected edge: Node with data ${from.value} or ${to.value} not found.`,
      );
      return;
    }

    // Add edge from 'from' to 'to' AND from 'to' to 'from'
    this.adjacencyList.get(from)!.push(new GraphEdge(to));
    this.adjacencyList.get(to)!.push(new GraphEdge(from));
    console.log(`Added unidirected edge between ${from.value} and ${to.value}`);
  }

  /**
   * Adds a weighted unidirected edge between two nodes.
   * This creates symmetric weighted edges in the adjacency list with the same weight.
   * Nodes must already exist in the graph.
   * @param from The data of one node involved in the edge. Must implement `DataShapeWithValue`.
   * @param to The data of the other node involved in the edge. Must implement `DataShapeWithValue`.
   * @param weight The weight of the edge.
   */
  addWeightedEdge(from: T, to: T, weight: number): void {
    // Ensure both nodes exist before adding edge
    if (!this.hasNode(from) || !this.hasNode(to)) {
      console.error(
        `Cannot add unidirected weighted edge: Node with data ${from.value} or ${to.value} not found.`,
      );
      return;
    }

    // Add weighted edge from 'from' to 'to' AND from 'to' to 'from'
    this.adjacencyList.get(from)!.push(new GraphEdge(to, weight));
    this.adjacencyList.get(to)!.push(new GraphEdge(from, weight)); // Unidirected weighted edges have the same weight in both directions
    console.log(
      `Added unidirected weighted edge between ${from.value} and ${to.value} with weight ${weight}`,
    );
  }
}
