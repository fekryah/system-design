import { LeastRecentlyUsedCache } from './lru-cache';

const CACHE_CAPACITY = 10;

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
    const cache = new LeastRecentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < CACHE_CAPACITY; i++) {
      cache.set(`KEY__${i}`, i.toString());
    }

    expect(cache.get(key)).toBeUndefined();
  });

  it('returns the stored value for stored, but not evicted keys', () => {
    const cache = new LeastRecentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(CACHE_CAPACITY / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);

    for (let i = 0; i < CACHE_CAPACITY; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBeUndefined();
  });

  it('updates most recent used keys on setting key value', () => {
    const cache = new LeastRecentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(CACHE_CAPACITY / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    cache.set(key, value);

    for (let i = 0; i < CACHE_CAPACITY - 1; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);
  });

  it('updates most recent used keys on getting key value', () => {
    const cache = new LeastRecentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'MAIN_KEY';
    const value = 'MAIN_VALUE';
    cache.set(key, value);

    for (let i = 0; i < Math.round(CACHE_CAPACITY / 2); i++) {
      cache.set(`KEY__${i}__FIRST_ROUND`, i.toString());
    }

    cache.get(key);

    for (let i = 0; i < CACHE_CAPACITY - 1; i++) {
      cache.set(`KEY__${i}__SECOND_ROUND`, i.toString());
    }

    expect(cache.get(key)).toBe(value);
  });
});
