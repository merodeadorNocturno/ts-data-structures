/**
 * This module provides a simple wrapper class for numbers
 * that implements the `Comparable` interface, making it suitable
 * for use in data structures that require comparable elements,
 * such as the BinaryTree. It also includes a static `fromString`
 * method required for deserialization purposes.
 * @module
 */

import type { Comparable } from "../interfaces/Comparable.ts";

/**
 * A wrapper class for a number that implements the `Comparable` interface.
 * This allows numbers to be used in data structures that require comparison logic.
 * @implements {Comparable<NumberWrapper>}
 */
export class NumberWrapper implements Comparable<NumberWrapper> {
  /**
   * The numerical value stored in the wrapper.
   */
  value: number;

  /**
   * Creates a new NumberWrapper instance.
   * @param value The number to wrap.
   */
  constructor(value: number) {
    this.value = value;
  }

  /**
   * Compares this NumberWrapper to another NumberWrapper based on their values.
   * @param other The other NumberWrapper to compare against.
   * @returns A negative number if this value is less than the other,
   *          zero if they are equal, or a positive number if this value is greater.
   */
  compareTo(other: NumberWrapper): number {
    return this.value - other.value;
  }

  /**
   * Returns the string representation of the wrapped number value.
   * @returns The string representation of the number.
   */
  toString(): string {
    return this.value.toString();
  }

  /**
   * Creates a new NumberWrapper instance from a string representation.
   * This static method is required for deserialization of data structures
   * that store `Comparable` types (like BinaryTree).
   * @param s The string to parse into a number and wrap.
   * @returns A new NumberWrapper instance containing the parsed number.
   */
  static fromString(s: string): NumberWrapper {
    return new NumberWrapper(parseInt(s, 10));
  }
}
