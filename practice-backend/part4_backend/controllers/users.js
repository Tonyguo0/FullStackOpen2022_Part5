const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    // Mongoose first queires the users collection for all user documents
    const users = await User.find({})
        // argument given to the populate method defines that
        // the ids referencing note objects
        // in the notes field of the user document
        // will be replaced by the reference note documents
        .populate(
            'notes',
            // select only the content and important fields of the note documents to display
            {
                content: 1,
                important: 1
            }
        );
    response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

module.exports = usersRouter;
