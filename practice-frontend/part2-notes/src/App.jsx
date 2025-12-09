// cd FullStackOpen2022_Part2/practices/part2-notes
import { useEffect, useState, useRef } from 'react';
import Footer from './components/Footer';
import LoginForm from './components/Login';
import Note from './components/Note';
import NoteForm from './components/NoteForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import loginService from './services/login';
import noteService from './services/notes';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    // the noteFormRef variable acts as a reference to the Togglable component for the note form
    // this hook ensures that we can access the Togglable component's methods and properties from
    // within the App component
    const noteFormRef = useRef();

    // get all notes from url with useEffect hook
    const hooks = () => {
        // console.log("effect");
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    };
    useEffect(hooks, []);

    useEffect(() => {
        // check if user is logged in by looking at local storage
        // if found, parse the user and SET the user state and token
        // for the note service
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);
    // console.log("render", notes.length, "notes");

    // when addnote is clicked
    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        // post the new note to the server, then set the notes into the notes object,
        // then set the New Note to empty which links with the input field
        noteService.create(noteObject).then((returnedNote) => {
            setNotes(notes.concat(returnedNote));
        });
    };

    // clicking on show important button triggers the ternary operator here
    // at render to make note into whatever based on showAll state is true or false by filtering

    // we've now changed notesToShow to a const instead of
    // state since it's derived from notes and showAll states
    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important === true);

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id);
        const changedNote = { ...note, important: !note.important };
        // when we use put, it already sets the changedNote into the notes url, so when we use setNotes, if it equals to id then it should be the response data/returnedNote/changedNote else set the important value to before change
        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                console.log(returnedNote);
                setNotes(
                    notes.map((note) => (note.id === id ? returnedNote : note))
                );
            })
            .catch(() => {
                console.log('inside the error');
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                );
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((n) => n.id !== id));
            });
        // console.log(`Importance of ${id} needs to be toggled`);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password
            });
            // save the logged in user to local storage
            // so that the user remains logged in even after refreshing the page
            // we save the user as a stringified JSON object
            // we can retrieve it and parse it back to object when needed

            // good todo: best practice is to save the signed in user as httpOnly cookie
            // but for the sake of this example, we will use local storage
            // but the thing is it would make implementing SPA applications a bit more complex
            // we need to at least implement a separate page for logging in
            window.localStorage.setItem(
                'loggedNoteappUser',
                JSON.stringify(user)
            );
            // need to set the token for the noteService to authenticate requests with successful login

            noteService.setToken(user.token);
            setUser(user);
            setUsername('');
            setPassword('');
        } catch {
            setErrorMessage('Wrong credentials');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const loginForm = () => (
        // TODO: improve the login form to adapt to the togglable component
        // display styles for toggling login form visibility

        <Togglable buttonLabel="log in">
            <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
            />
        </Togglable>
    );
    //TODO: delete this noteForm function since we are using NoteForm component now
    // but keep the logout button inside
    const noteForm = () => (
        //  button label to create a new note
        <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
        </Togglable>
    );

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {/* here to render the form conditionally */}
            {/* if the user is not logged in */}
            {/* show the login form */}
            {/* else show the note form */}
            {!user && loginForm()}
            {user && (
                <div>
                    {/* this is all user logged in handling */}
                    <p>{user.name} logged in</p>
                    <button
                        type="primary"
                        onClick={() => {
                            // clear the local storage to log out the user
                            window.localStorage.clear();
                            setUser(null);
                        }}
                    >
                        logout
                    </button>
                    {/* note form here */}
                    {noteForm()}
                </div>
            )}
            <div>
                <Togglable buttonLabel="1">First</Togglable>
                <Togglable buttonLabel="2">Second</Togglable>
                <Togglable buttonLabel="3">Third</Togglable>
            </div>

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) => (
                    // console.log(note)
                    // Note is in component folder
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>

            <Footer />
        </div>
    );
};

export default App;
