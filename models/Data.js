'use strict';

/**
 * Key value table used to store misc data
 */
module.exports = class Data {
    constructor(db) {
        this.db = db;
    }

    get(key) {
        return '{"name": "justin", "score": "0.001"}';
    }

    add(key, value) {

    }

    update(key, value) {

    }

    delete(key) {

    }
}
