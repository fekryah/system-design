import { AbstractCache } from './abstract-cahce';

export class LeastRecentlyUsedCache<T> extends AbstractCache<T> {
  constructor(capacity: number) {
    super();
  }

  get(key: string): T | undefined {
    return;
  }

  set(key: string, value: T): void {}
}
