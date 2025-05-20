/**
 * This module defines interfaces and types used across the data structure library,
 * particularly for enabling comparison and value-based operations.
 * @module
 */

/**
 * Defines a contract for objects that can be compared to another object of the same type.
 * This is essential for data structures like Binary Trees that require ordering.
 */
export interface Comparable<T> {
  /**
   * Compares this object with the specified object for order.
   * Returns a negative integer, zero, or a positive integer as this object
   * is less than, equal to, or greater than the specified object.
   * @param other The object to be compared.
   * @returns A negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object.
   */
  compareTo(other: T): number;
  /**
   * Returns a string representation of the object.
   * @returns A string representation of the object.
   */
  toString(): string;
}

/**
 * Represents a type that has a numeric `value` property.
 */
export type ValueProperty = {
  value: number;
};

/**
 * Defines a contract for objects used in data structures (like Graphs)
 * that require a numeric `value` property for operations like traversal
 * (e.g., using the value as a unique identifier for visited sets).
 * It extends `ValueProperty` and allows for any additional properties.
 */
export type DataShapeWithValue = ValueProperty & Record<string, unknown>;
