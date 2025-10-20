import { AbstractCache } from './abstract-cahce';

class Node<T> {
  value: T;
  key: string;
  next: Node<T> | undefined;
  prev: Node<T> | undefined;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
  }
}

export class LeastRecentlyUsedCache<T> extends AbstractCache<T> {
  private capacity: number;
  private map: Map<string, Node<T>>;
  private head: Node<T>;
  private tail: Node<T>;

  constructor(capacity: number) {
    super();
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node('UNIQUE TAIl', 's' as T);
    this.tail = new Node('UNIQUE TAIL', 's' as T);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: string): T | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    this.moveToFront(node);

    return node.value;
  }

  set(key: string, value: T): void {
    const node = this.map.get(key);

    if (!node) {
      const newNode = new Node(key, value);
      this.addToFront(newNode);
      this.map.set(key, newNode);
    } else {
      node.value = value;
      this.moveToFront(node);
    }

    if (this.map.size > this.capacity) this.evict();
  }

  private moveToFront(node: Node<T>) {
    this.removeNode(node);
    this.addToFront(node);
  }

  private addToFront(node: Node<T>) {
    node.next = this.head.next;
    this.head.next!.prev = node;

    node.prev = this.head;
    this.head.next = node;
  }

  private removeNode(node: Node<T>) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private evict() {
    const lru = this.tail.prev!;
    this.removeNode(lru);
    this.map.delete(lru.key);
  }
}
