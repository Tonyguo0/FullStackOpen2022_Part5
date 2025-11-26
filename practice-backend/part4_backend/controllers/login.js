const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    // find user by username
    const user = await User.findOne({ username });

    // check if user exists and password is correct
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        });
    }

    // create token payload with username and id
    const userForToken = {
        username: user.username,
        id: user._id
    };

    // token expires in 3600 seconds which is 1 hour
    const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60
    });

    // prettier-ignore
    res
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
