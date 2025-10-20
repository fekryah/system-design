import { LeastFrequentlyUsedCache } from './lfu-cache';

const CACHE_CAPACITY = 10;

describe('Least frequently used cache test', () => {
  it('returns the stored value when the key exists', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'KEY 1';
    const value = 'VALUE 1';

    cache.set(key, value);
    expect(cache.get(key)).toBe(value);
  });

  it('updates keys properly', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'KEY 1';

    const value1 = 'VALUE 1';
    cache.set(key, value1);

    const value2 = 'VALUE 2';
    cache.set(key, value2);

    expect(cache.get(key)).toBe(value2);
  });

  it('returns undefined for a missing key', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const key = 'KEY';

    expect(cache.get(key)).toBeUndefined();
  });

  it('does not evict keys with higher frequency when cache is full', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const mostFrequentlyUsedKey = 'MOST_FREQUENTLY_USED_KEY';
    const mostFrequentlyUsedValue = 'MOST_FREQUENTLY_USED_VAL';

    cache.set(mostFrequentlyUsedKey, mostFrequentlyUsedValue);
    cache.set(mostFrequentlyUsedKey, mostFrequentlyUsedValue);

    for (let i = 0; i < CACHE_CAPACITY; i++) {
      cache.set(`KEY__${i}`, i.toString());
    }

    expect(cache.get(mostFrequentlyUsedKey)).toBe(mostFrequentlyUsedValue);
  });

  it('gives priority to most frequently used keys, even there are high frequesntly used keys', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const mainKey = 'MOST_FREQUENTLY_USED_KEY';
    const mainValue = 'MOST_FREQUENTLY_USED_VAL';

    /** Has frequency of 2 */
    cache.set(mainKey, mainValue);
    cache.set(mainKey, mainValue);

    for (let i = 0; i < CACHE_CAPACITY; i++) {
      /** Each key has frequency of 3 */
      cache.set(`KEY__${i}`, i.toString());
      cache.set(`KEY__${i}`, i.toString());
      cache.set(`KEY__${i}`, i.toString());
    }

    expect(cache.get(mainKey)).toBeUndefined();
  });

  it('evicts oldest keys if they are equal in frequency', () => {
    const cache = new LeastFrequentlyUsedCache<string>(CACHE_CAPACITY);

    const mainKeyOlder = 'MOST_FREQUENTLY_USED_KEY_OLDER';
    const mainValueOlder = 'MOST_FREQUENTLY_USED_VAL_OLDER';

    const mainKeyNewer = 'MOST_FREQUENTLY_USED_KEY_NEWER';
    const mainValueNewer = 'MOST_FREQUENTLY_USED_VAL_NEWER';

    /** Has frequency of 2 */
    cache.set(mainKeyOlder, mainValueOlder);
    cache.set(mainKeyOlder, mainValueOlder);

    cache.set(mainKeyNewer, mainValueNewer);
    cache.set(mainKeyNewer, mainValueNewer);

    for (let i = 0; i < CACHE_CAPACITY - 1; i++) {
      /** Each key has frequency of 3 */
      cache.set(`KEY__${i}`, i.toString());
      cache.set(`KEY__${i}`, i.toString());
      cache.set(`KEY__${i}`, i.toString());
    }

    expect(cache.get(mainKeyOlder)).toBeUndefined();
    expect(cache.get(mainKeyNewer)).toBe(mainValueNewer);
  });
});
