import { AbstractCache } from './abstract-cahce';

export class LeastFrequentlyUsedCache<T> extends AbstractCache<T> {
  constructor(capacity: number) {
    super();
    throw new Error('Method not implemented.');
  }

  get(key: string): T | undefined {
    throw new Error('Method not implemented.');
  }

  set(key: string, value: T): void {
    throw new Error('Method not implemented.');
  }
}
