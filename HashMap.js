'use strict';
/*
- Hash maps are unordered associations between keys and values. 
- Hashmaps are  data structures that use the concept of hashing.
- Hashing = process of mapping a key to a position in the hash table
- Hash table = Storage that holds the records (the key and any value associated with the key). Hash maps require a hash-table. The hash-table is usually implemented internally using an array. Each slot in the array hokds a key-value pair or is empty (null)
- Hash Function = maps keys to positions in the hash table.
- Collisions = when 2 unique keys hash to the same slot in the array
- Open addressing (collision resolution) = when a collision happens, it will hash the key to the empty slot nearest to where it should live.
- Separate chaining (collision resolution) = uses linked lists to hash the keys that run into collision. First slot contains the pointer to the head of the list. When a key collides with another, we use the next pointer to put the keys in a LL.
*/

class HashMap {
    constructor(initialCapacity = 8) {
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
        this._deleted = 0;
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._hashTable[index] === undefined) {
            throw new Error('Key error');
        }
        return this._hashTable[index].value;
    }

    set(key, value) {
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap.SIZE_RATIO);
        }
        const index = this._findSlot(key);

        if (!this._hashTable[index]) {
            this.length++;
        }
        this._hashTable[index] = {
            key,
            value,
            DELETED: false
        };
    }

    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }

    _findSlot(key) {
        const hash = HashMap._hashString(key);
        const start = hash % this._capacity;

        for (let i = start; i< start + this._capacity; i++){
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            }
        }
    }

    _resize(size){
        const oldSlot = this._hashTable;
        this._capacity = size;
        this.length = 0;
        this._deleted = 0;
        this._hashTable = [];

        for (const slot of oldSlot){
            if (slot !== undefined && !slot.DELETED) {
                this.set(slot.key, slot.value);
            }
        }
    }
}

module.exports = { HashMap };