//https://fullstackopen.com/en/part4/testing_the_backend#supertest

const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');

// test can use the api superagent object to make HTTP requests to the backend
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app');
const helper = require('./test_helper');
const Note = require('../models/note');
// if the server is not already
// listening for connections then
// it is bound to an ephemeral port
// for you so there is no need to
// keep track of ports.
const api = supertest(app);

// const { queryHelpers } = require('@testing-library/react');

// const logger = require('../utils/logger')

describe('when there is inititally some notes saved', () => {
    beforeEach(async () => {
        await Note.deleteMany({});

        // the easiest way to implement this is by utilizing Mongoose's built-in
        // method Model.insertMany()
        await Note.insertMany(helper.initialNotes);

        // old way of doing it manually without Promise.all
        // waiting for each save to complete before starting the next one
        // let noteObject = new Note(helper.initialNotes[0]);
        // await noteObject.save();

        // noteObject = new Note(helper.initialNotes[1]);
        // await noteObject.save();

        // this approach with forEach and async/await DOES NOT WORK as expected
        // because forEach does not handle async functions properly
        // the async function inside forEach creates a promise that is not awaited
        // so the beforeEach function completes before all notes are saved
        // resulting in tests running with an empty database
        // helper.initialNotes.forEach(async (note) => {
        //     const noteObject = new Note(note);
        //     await noteObject.save();
        //     console.log(`saved note ${note.content}`);
        // });

        // to fix this, we can use for ... of loop or Promise.all with map
        // this creates Note objects from the initial notes array
        // const noteObjects = helper.initialNotes.map((note) => new Note(note));

        // this creates an array of promises for saving each note
        // const promiseArray = noteObjects.map((note) => note.save());

        // the Promise.all waits for all promises in the array to complete
        // await Promise.all(promiseArray);

        // if we wanted to do it with for ... of loop
        //   for (let note of helper.initialNotes) {
        //     let noteObject = new Note(note)
        //     await noteObject.save()
        //   }
    });

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes');

        assert.strictEqual(response.body.length, helper.initialNotes.length);
    });

    test('a specific note in within the returned notes', async () => {
        const response = await api.get('/api/notes');

        const contents = response.body.map((r) => r.content);
        assert(contents.includes('HTML is easy'));
    });
});

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToView = notesAtStart[0];

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        // logger.info(`result note is ${JSON.stringify(resultNote)}`);

        // noteInDB is already converted to JSON object in the helper function
        // we need to convert noteToView's date to string first before comparison
        // because mongoose date is a Date object

        // this is fixed in the const noteSchema = new mongoose.Schema mapping's toJSON transform method
        // so we don't need to do this anymore:
        // noteToView.date = noteToView.date.toISOString();
        // const expectedNote = JSON.parse(JSON.stringify(noteToView));

        // deepStrictEqual does a deep comparison of objects
        // using the method Object.is to compare similarity
        assert.deepStrictEqual(resultNote.body, noteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';

        await api.get(`/api/notes/${invalidId}`).expect(400);
    });
});

describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true
        };

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukainen',
            password: 'salainen'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: newUser.username,
                password: newUser.password
            })
            .expect(200);

        const token = loginResponse.body.token;

        await api
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const notesAtEnd = await helper.notesInDb();
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

        const contents = notesAtEnd.map((r) => r.content);
        assert(contents.includes('async/await simplifies making async calls'));
        // const notesAtEnd = await helper.notesInDb();
        // expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

        // const contents = notesAtEnd.map((r) => r.content);

        // expect(contents).toContain('async/await simplifies making async calls');
    });

    test('fails with status code 401 if data is invalid', async () => {
        const newNote = {
            important: true
        };

        await api.post('/api/notes').send(newNote).expect(401);

        const notesAtEnd = await helper.notesInDb();

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
    });
});

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToDelete = notesAtStart[0];

        await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

        const notesAtEnd = await helper.notesInDb();

        const contents = notesAtEnd.map((r) => r.content);
        assert(!contents.includes(noteToDelete.content));

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
});

describe.only('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukainen',
            password: 'salainen'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statuscode and message if username is already in the db', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        };

        // this is now fixed in middleware.js errorHandler, express-async-errors is not needed
        // rn this is completing but is a socket error because the express-async-errors package isn't working
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();

        assert(result.body.error.includes('expected `username` to be unique'));
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

after(async () => {
    await mongoose.connection.close();
});
