import type { Comparable } from "../interfaces/Comparable.ts";

export class NumberWrapper implements Comparable<NumberWrapper> {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  compareTo(other: NumberWrapper): number {
    return this.value - other.value;
  }

  toString(): string {
    return this.value.toString();
  }

  static fromString(s: string): NumberWrapper {
    return new NumberWrapper(parseInt(s, 10));
  }
}
