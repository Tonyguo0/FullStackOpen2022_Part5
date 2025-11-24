const { test } = require('node:test');
const assert = require('node:assert');

// imports the function to be tested and assigns it to the variable reverse
const reverse = require('../utils/for_testing').reverse;

// test description as a string and a function that runs the test
test('reverse of a', () => {
    const result = reverse('a');

    assert.strictEqual(result, 'a');
});

test('reverse of react', () => {
    const result = reverse('react');

    assert.strictEqual(result, 'tcaer');
});

test('reverse of releveler', () => {
    const result = reverse('releveler');

    assert.strictEqual(result, 'releveler');
});
