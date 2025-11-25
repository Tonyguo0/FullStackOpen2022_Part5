const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // this ensures the uniqueness of username
    },
    name: String,
    passwordHash: String,
    //The functionality of the populate method of Mongoose
    // is based on the fact that we have defined "types"
    // to the references in the Mongoose schema with the ref option:
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
