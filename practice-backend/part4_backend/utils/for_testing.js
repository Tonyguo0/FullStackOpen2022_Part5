const reverse = (string) => {
    return string.split("").reverse().join("");
};

const average = (array) => {
    // reduce can be used to accumulate values in an array
    // sum function to be used with reduce, 
    // essentially reducing the array to a single sum value
    // sum = previous sum + current item in the array, 
        // e.g. if sum = 3 and current item is 5, new sum in the next reduce = 8
    const reducer = (sum, item) => {
        return sum + item;
    };
    // uses reducer to sum up the array elements and divides by length to get average
    // the second argument to reduce (0) sets the initial sum to 0
    return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

module.exports = {
    reverse,
    average
};
