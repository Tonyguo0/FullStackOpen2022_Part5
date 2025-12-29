//
const infoAll = (...params) => {
    console.log(...params);
};

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};

const test = (...params) => {
    if (process.env.NODE_ENV === 'test') {
        console.log(...params);
    }
};

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params);
    }
};

module.exports = {
    infoAll,
    info,
    test,
    error
};
