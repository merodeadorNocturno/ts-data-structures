import type {
  Comparable,
  DataShapeWithValue,
} from "../interfaces/Comparable.ts";

export class Node<T extends DataShapeWithValue> {
  next: Node<T> | null;
  data: T;
  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class TreeNode<T extends Comparable<T>>
  implements Comparable<TreeNode<T>>
{
  data: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

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
