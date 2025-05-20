import { TreeNode } from "./Nodes.ts";
import type { Comparable } from "../interfaces/Comparable.ts";

export class BinaryTree<T extends Comparable<T>> {
  root: TreeNode<T> | null;
  private ctor: { fromString(s: string): T };

  constructor(value: T, ctor: { fromString(s: string): T }) {
    this.root = new TreeNode(value);
    this.ctor = ctor;
  }

  insert(value: T): void {
    const newTreeNode = new TreeNode(value);
    if (!this.root) {
      this.root = newTreeNode;
    } else {
      this.insertNode(this.root, newTreeNode);
    }
  }

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

  height(treeNode: TreeNode<T> | null = this.root): number {
    if (!treeNode) {
      return -1; // Height of an empty tree or null node
    }
    return (
      1 + Math.max(this.height(treeNode.left), this.height(treeNode.right))
    );
  }

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

  countNodes(treeNode: TreeNode<T> | null = this.root): number {
    if (!treeNode) {
      return 0;
    }
    return 1 + this.countNodes(treeNode.left) + this.countNodes(treeNode.right);
  }

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

  serialize(): string {
    const result: string[] = [];
    this.serializeHelper(this.root, result);
    return result.join(",");
  }

  private serializeHelper(node: TreeNode<T> | null, result: string[]): void {
    if (node === null) {
      result.push("#"); // Use '#' to represent null
    } else {
      result.push(node.data.toString()); // Relies on T having a meaningful toString()
      this.serializeHelper(node.left, result);
      this.serializeHelper(node.right, result);
    }
  }

  deserialize(data: string): void {
    const values = data.split(",");
    this.root = this.deserializeHelper(values);
  }

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
