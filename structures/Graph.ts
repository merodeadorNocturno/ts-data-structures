import type { DataShapeWithValue } from "../interfaces/Comparable.ts";

// Class to represent an edge in the graph
class GraphEdge<T extends DataShapeWithValue> {
  constructor(
    public target: T, // The data of the target node
    public weight?: number, // Optional weight for the edge
  ) {}
}

// Common methods for both directed and undirected graphs
class CommonGraphMethods<T extends DataShapeWithValue> {
  // Use a Map for adjacency list: maps source node data to a list of outgoing edges
  protected adjacencyList: Map<T, GraphEdge<T>[]>;
  // Keep track of all nodes in the graph
  protected nodes: T[];

  constructor() {
    this.adjacencyList = new Map();
    this.nodes = [];
  }

  /**
   * Adds a node to the graph if it doesn't already exist.
   * @param data The data for the new node.
   */
  addNode(data: T): void {
    // Use JSON.stringify for reliable Map key comparison with objects,
    // or rely on object reference equality if T objects are reused.
    // Let's assume object reference equality or unique data values for simplicity here.
    if (!this.adjacencyList.has(data)) {
      this.adjacencyList.set(data, []);
      this.nodes.push(data);
      // console.log(`Added node with data: ${data.value}`); // Assuming T has a value property - disable for cleaner output
    } else {
      // console.log(`Node with data: ${data.value} already exists.`); // disable for cleaner output
    }
  }

  /**
   * Checks if a node exists in the graph.
   * @param data The data of the node to check.
   * @returns true if the node exists, false otherwise.
   */
  hasNode(data: T): boolean {
    return this.adjacencyList.has(data);
  }

  /**
   * Gets all nodes currently in the graph.
   * @returns An array of node data.
   */
  getNodes(): T[] {
    return this.nodes;
  }

  /**
   * Gets the outgoing edges (neighbors) for a given node.
   * @param data The data of the source node.
   * @returns An array of GraphEdge objects, or undefined if the node is not found.
   */
  getNeighbors(data: T): GraphEdge<T>[] | undefined {
    return this.adjacencyList.get(data);
  }

  // addEdge and addWeightedEdge implementations differ for directed/undirected,
  // so they are defined in the respective subclasses.

  /**
   * Performs a Breadth-First Search (BFS) traversal starting from a given node.
   * @param startNodeData The data of the node to start the traversal from.
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
   * @param startNodeData The data of the node to start the traversal from.
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
}

export class Directed<
  T extends DataShapeWithValue,
> extends CommonGraphMethods<T> {
  constructor() {
    super();
    console.log("Created a Directed Graph");
  }

  /**
   * Adds an unweighted directed edge from one node to another.
   * @param from The data of the source node.
   * @param to The data of the target node.
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
   * @param from The data of the source node.
   * @param to The data of the target node.
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

export class Unidirected<
  T extends DataShapeWithValue,
> extends CommonGraphMethods<T> {
  constructor() {
    super();
    console.log("Created an Unidirected Graph");
  }

  /**
   * Adds an unweighted unidirected edge between two nodes.
   * This adds edges in both directions in the adjacency list.
   * @param from The data of one node.
   * @param to The data of the other node.
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
   * This adds weighted edges in both directions with the same weight.
   * @param from The data of one node.
   * @param to The data of the other node.
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
