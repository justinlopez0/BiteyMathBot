'use strict';

var Data = require("./Data.js");

module.exports = class FastestAnswer extends Data {
    get() {
        return JSON.parse(super.get('fastest_answer'));
    }
}