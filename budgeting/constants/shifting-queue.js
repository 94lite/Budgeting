export class ShiftingQueue {
  constructor(props) {
    this.head = props || null;
  }

  peek() {
    return this.head;
  }

  pop() {
    if (this.head !== null) {
      const node = this.head;
      this.head = node.next;
      return node;
    }
    return null;
  }

  insert(node, f) {
    let current = this.head;
    if (current === null) {
      // if the queue is empty then insert new node as the head
      this.head = node;
    } else if (!f) {
      // if compare function is not provuded then add to end
      while (current.next) {
        current = current.next;
      }
      current.setNext(node);
    } else {
      let prev = null;
      let inserted = false;
      while (current) {
        if (f(current.value, node.value)) {
          // if current.value > node.value then insert new node before current
          if (prev === null) {
            // if node to be inserted precedes the current head
            this.head = node;
          } else {
            // node to be inserted excedes the current head
            prev.setNext(node);
          }
          inserted = true;
          node.setNext(current);
          break;
        }
        prev = current;
        current = current.next;
      }
      if (!inserted) {
        // if reached the end of the queue then attach at end
        prev.setNext(node);
      }
    }
  }
};

export class Node {
  constructor(props) {
    this.value = props;
    this.next = null;
  }

  setNext(node) {
    this.next = node;
  }
}