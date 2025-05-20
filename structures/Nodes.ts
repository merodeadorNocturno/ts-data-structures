/**
 * This module defines the fundamental Node classes used in various data structures
 * like Singly Linked Lists and Binary Trees.
 * @module
 */

import type {
  Comparable,
  DataShapeWithValue,
} from "../interfaces/Comparable.ts";

/**
 * Represents a single node in a linked list.
 * @template T The type of data stored in the node. Must implement `DataShapeWithValue`.
 */
export class Node<T extends DataShapeWithValue> {
  /**
   * A reference to the next node in the list, or `null` if this is the last node.
   */
  next: Node<T> | null;
  /**
   * The data stored within the node. Must implement `DataShapeWithValue`.
   */
  data: T;

  /**
   * Creates a new Node instance.
   * @param data The data to store in the node. Must implement `DataShapeWithValue`.
   */
  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

/**
 * Represents a single node in a binary tree.
 * @template T The type of data stored in the tree node. Must implement `Comparable<T>`.
 */
export class TreeNode<T extends Comparable<T>>
  implements Comparable<TreeNode<T>>
{
  /**
   * The data stored within the tree node. Must implement `Comparable<T>`.
   */
  data: T;
  /**
   * A reference to the left child node, or `null` if it doesn't exist.
   */
  left: TreeNode<T> | null;
  /**
   * A reference to the right child node, or `null` if it doesn't exist.
   */
  right: TreeNode<T> | null;

  /**
   * Creates a new TreeNode instance.
   * @param value The value to store in the node. Must implement `Comparable<T>`.
   */
  constructor(value: T) {
    this.data = value;
    this.left = null;
    this.right = null;
  }

  /**
   * Compares this TreeNode with another TreeNode based on their data.
   * The comparison logic is delegated to the compareTo method of type T.
   * @param other The other TreeNode to compare against.
   * @returns A number indicating the comparison result:
   *          - Negative if this node's data is less than other's.
   *          - Zero if this node's data is equal to other's.
   *          - Positive if this node's data is greater than other's.
   */
  compareTo(other: TreeNode<T>): number {
    return this.data.compareTo(other.data);
  }

  /**
   * Returns a string representation of the TreeNode's data.
   * This relies on the toString method of the data type T.
   * @returns String representation of the node's data.
   */
  toString(): string {
    return this.data.toString();
  }
}
