export interface Comparable<T> {
  compareTo(other: T): number;
  toString(): string;
}

export type ValueProperty = {
  value: number;
};

export type DataShapeWithValue = ValueProperty & Record<string, unknown>;
