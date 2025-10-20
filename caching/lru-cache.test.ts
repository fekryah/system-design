import { LeastRecentlyUsedCache } from './lru-cache';

/**
 * - set and get
 * - get in-existing key
 * - set, then fill it and try to get first one
 * - set, then fill it before end, and try to get first one you pushed
 *
 *
 */

describe('Least recently used cache test', () => {
  it('returns the stored value when the key exists', () => {
    const cache = new LeastRecentlyUsedCache<string>(10);

    const key = 'KEY 1';
    const value = 'VALUE 1';

    cache.set(key, value);
    expect(cache.get(key)).toBe(value);
  });

  it('updates keys properly', () => {
    const cache = new LeastRecentlyUsedCache<string>(10);

    const key = 'KEY 1';

    const value1 = 'VALUE 1';
    cache.set(key, value1);

    const value2 = 'VALUE 2';
    cache.set(key, value2);

    expect(cache.get(key)).toBe(value2);
  });

  it('returns undefined for a missing key', () => {
    const cache = new LeastRecentlyUsedCache<string>(10);

    const key = 'KEY';

    expect(cache.get(key)).toBeUndefined();
  });

  it('returns undefined for evicted keys', () => {
    const cacheCapacity = 10;
    const cache = new LeastRecentlyUsedCache<string>(cacheCapacity);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < cacheCapacity; i++) {
      cache.set(`KEY__${i}`, i.toString());
    }

    expect(cache.get(key)).toBeUndefined();
  });

  it('returns the stored value for stored, but not evicted keys', () => {
    const cacheCapacity = 10;
    const cache = new LeastRecentlyUsedCache<string>(cacheCapacity);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(cacheCapacity / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);

    for (let i = 0; i < cacheCapacity; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBeUndefined();
  });

  it('updates most recent used keys on setting key value', () => {
    const cacheCapacity = 10;
    const cache = new LeastRecentlyUsedCache<string>(cacheCapacity);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(cacheCapacity / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    cache.set(key, value);

    for (let i = 0; i < cacheCapacity - 1; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);
  });

  it('updates most recent used keys on getting key value', () => {
    const cacheCapacity = 10;
    const cache = new LeastRecentlyUsedCache<string>(cacheCapacity);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(cacheCapacity / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    cache.get(key);

    for (let i = 0; i < cacheCapacity - 1; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);
  });
});
