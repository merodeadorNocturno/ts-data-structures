/**
 * Implementation of a Binary Search Tree (BST).
 * The tree stores nodes with data that must implement the `Comparable` interface
 * and provide a static `fromString` method for deserialization.
 * @module
 */
import { TreeNode } from "./Nodes.ts";
import type { Comparable } from "../interfaces/Comparable.ts";

/**
 * Implementation of a Binary Search Tree (BST).
 * The tree stores nodes with data that must implement the `Comparable` interface
 * and provide a static `fromString` method for deserialization.
 */
export class BinaryTree<T extends Comparable<T>> {
  /** The root node of the binary tree. */
  root: TreeNode<T> | null;
  /** A reference to the constructor with a `fromString` method for type T, used during deserialization. */
  private ctor: { fromString(s: string): T };

  /**
   * Creates a new BinaryTree with an initial root node.
   * @param value The value for the root node. Must implement `Comparable<T>`.
   * @param ctor A constructor function or object for type T that has a static `fromString` method.
   */
  constructor(value: T, ctor: { fromString(s: string): T }) {
    this.root = new TreeNode(value);
    this.ctor = ctor;
  }

  /**
   * Inserts a new value into the binary search tree.
   * @param value The value to insert. Must implement `Comparable<T>`.
   */
  insert(value: T): void {
    const newTreeNode = new TreeNode(value);
    if (!this.root) {
      this.root = newTreeNode;
    } else {
      this.insertNode(this.root, newTreeNode);
    }
  }

  /**
   * Recursive helper method to insert a new node into the tree.
   * @param treeNode The current node being compared against.
   * @param newTreeNode The new node to insert.
   */
  private insertNode(treeNode: TreeNode<T>, newTreeNode: TreeNode<T>): void {
    if (newTreeNode.data.compareTo(treeNode.data) < 0) {
      if (!treeNode.left) {
        treeNode.left = newTreeNode;
      } else {
        this.insertNode(treeNode.left, newTreeNode);
      }
    } else {
      if (!treeNode.right) {
        treeNode.right = newTreeNode;
      } else {
        this.insertNode(treeNode.right, newTreeNode);
      }
    }
  }

  /**
   * Performs an in-order traversal of the binary tree.
   * @param treeNode The current node to start traversal from (defaults to the root).
   * @param result An array to store the visited nodes (used internally during recursion).
   * @returns An array of TreeNodes in in-order sequence.
   */
  traverseInOrder(
    treeNode: TreeNode<T> | null = this.root,
    result: TreeNode<T>[] = [],
  ): TreeNode<T>[] {
    if (treeNode) {
      this.traverseInOrder(treeNode.left, result);
      result.push(treeNode);
      this.traverseInOrder(treeNode.right, result);
    }
    return result;
  }

  /**
   * Finds the node with the minimum value in the subtree rooted at the given node.
   * @param treeNode The root of the subtree to search in (defaults to the main root).
   * @returns The minimum value found, or null if the subtree is empty.
   */
  findMin(treeNode: TreeNode<T> | null = this.root): T | null {
    if (!treeNode) {
      return null;
    }
    let current = treeNode;
    while (current.left) {
      current = current.left;
    }
    return current.data;
  }

  /**
   * Finds the node with the maximum value in the subtree rooted at the given node.
   * @param treeNode The root of the subtree to search in (defaults to the main root).
   * @returns The maximum value found, or null if the subtree is empty.
   */
  findMax(treeNode: TreeNode<T> | null = this.root): T | null {
    if (!treeNode) {
      return null;
    }
    let current = treeNode;
    while (current.right) {
      current = current.right;
    }
    return current.data;
  }

  /**
   * Checks if a value exists in the binary search tree.
   * @param value The value to search for. Must implement `Comparable<T>`.
   * @param treeNode The current node to start the search from (defaults to the root).
   * @returns True if the value is found, false otherwise.
   */
  contains(value: T, treeNode: TreeNode<T> | null = this.root): boolean {
    if (!treeNode) {
      return false;
    }
    const comparison = value.compareTo(treeNode.data);
    if (comparison === 0) {
      return true;
    }
    return comparison < 0
      ? this.contains(value, treeNode.left)
      : this.contains(value, treeNode.right);
  }

  /**
   * Deletes a value from the binary search tree.
   * This method modifies the tree in place and handles the cases for nodes with zero, one, or two children.
   * @param value The value to delete. Must implement `Comparable<T>`.
   * @param treeNode The current node being examined (defaults to the root).
   * @returns The updated subtree root after deletion, or null if the node was the root and was deleted.
   */
  delete(
    value: T,
    treeNode: TreeNode<T> | null = this.root,
  ): TreeNode<T> | null {
    if (!treeNode) {
      return null; // Value not found, or tree is empty
    }

    const comparison = value.compareTo(treeNode.data);

    if (comparison < 0) {
      treeNode.left = this.delete(value, treeNode.left);
    } else if (comparison > 0) {
      treeNode.right = this.delete(value, treeNode.right);
    } else {
      // Node with the value to be deleted is found

      // Case 1: Node has no children (it's a leaf node)
      if (!treeNode.left && !treeNode.right) {
        return null;
      }

      // Case 2: Node has only one child
      if (!treeNode.left) {
        return treeNode.right; // Promote the right child
      }
      if (!treeNode.right) {
        return treeNode.left; // Promote the left child
      }

      // Case 3: Node has two children
      // Find the in-order successor (smallest value in the right subtree)
      const successorData = this.findMin(treeNode.right);
      if (successorData !== null) {
        treeNode.data = successorData;
        // Delete the in-order successor from the right subtree
        treeNode.right = this.delete(successorData, treeNode.right);
      }
    }
    return treeNode; // Return the (possibly modified) node
  }

  /**
   * Calculates the height of the subtree rooted at the given node.
   * The height of an empty tree or null node is -1. The height of a single node is 0.
   * @param treeNode The root of the subtree (defaults to the main root).
   * @returns The height of the subtree.
   */
  height(treeNode: TreeNode<T> | null = this.root): number {
    if (!treeNode) {
      return -1; // Height of an empty tree or null node
    }
    return (
      1 + Math.max(this.height(treeNode.left), this.height(treeNode.right))
    );
  }

  /**
   * Checks if the binary tree is balanced.
   * A tree is balanced if for every node, the height difference between its left and right subtrees is no more than 1.
   * @param treeNode The current node to check for balance (defaults to the root).
   * @returns True if the tree is balanced, false otherwise.
   */
  isBalanced(treeNode: TreeNode<T> | null = this.root): boolean {
    if (!treeNode) {
      return true; // An empty tree is considered balanced
    }
    const heightDifference = Math.abs(
      this.height(treeNode.left) - this.height(treeNode.right),
    );
    return (
      heightDifference <= 1 &&
      this.isBalanced(treeNode.left) &&
      this.isBalanced(treeNode.right)
    );
  }

  /**
   * Counts the total number of nodes in the subtree rooted at the given node.
   * @param treeNode The root of the subtree (defaults to the main root).
   * @returns The number of nodes in the subtree.
   */
  countNodes(treeNode: TreeNode<T> | null = this.root): number {
    if (!treeNode) {
      return 0;
    }
    return 1 + this.countNodes(treeNode.left) + this.countNodes(treeNode.right);
  }

  /**
   * Performs a Breadth-First Search (BFS) traversal on the binary tree.
   * @returns An array of the data from the nodes in BFS order.
   */
  bfs(): T[] {
    const queue: (TreeNode<T> | null)[] = [this.root];
    const result: T[] = [];
    while (queue.length > 0) {
      const treeNode = queue.shift();
      if (treeNode) {
        result.push(treeNode.data);
        if (treeNode.left) {
          queue.push(treeNode.left);
        }
        if (treeNode.right) {
          queue.push(treeNode.right);
        }
      }
    }
    return result;
  }

  /**
   * Serializes the binary tree into a string representation using pre-order traversal.
   * Null nodes are represented by the character '#'.
   * @returns A string representing the tree structure.
   */
  serialize(): string {
    const result: string[] = [];
    this.serializeHelper(this.root, result);
    return result.join(",");
  }

  /**
   * Recursive helper method to serialize the tree into a string array.
   * @param node The current node to serialize.
   * @param result The array accumulating the string representation.
   */
  private serializeHelper(node: TreeNode<T> | null, result: string[]): void {
    if (node === null) {
      result.push("#"); // Use '#' to represent null
    } else {
      result.push(node.data.toString()); // Relies on T having a meaningful toString()
      this.serializeHelper(node.left, result);
      this.serializeHelper(node.right, result);
    }
  }

  /**
   * Deserializes a string representation of a binary tree back into a tree structure.
   * Requires the type `T` to have a static `fromString` method.
   * @param data The string representation of the tree, typically generated by `serialize()`.
   */
  deserialize(data: string): void {
    const values = data.split(",");
    this.root = this.deserializeHelper(values);
  }

  /**
   * Recursive helper method to deserialize the tree from a string array.
   * @param values The array of string values representing the tree nodes in a pre-order fashion.
   * @returns The reconstructed TreeNode, or null if the value indicates a null node.
   */
  private deserializeHelper(values: string[]): TreeNode<T> | null {
    const valueStr = values.shift();

    if (valueStr === "#" || valueStr === undefined) {
      return null;
    }

    const nodeValue = this.ctor.fromString(valueStr);
    const node = new TreeNode(nodeValue);
    node.left = this.deserializeHelper(values);
    node.right = this.deserializeHelper(values);
    return node;
  }
}
