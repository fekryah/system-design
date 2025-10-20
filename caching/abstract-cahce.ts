export abstract class AbstractCache<T> {
  abstract get(key: string): T | undefined;
  abstract set(key: string, value: T): void;
}
