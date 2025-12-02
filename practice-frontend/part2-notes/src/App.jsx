// cd FullStackOpen2022_Part2/practices/part2-notes
import Note from "./components/Note";
import noteService from "./services/notes";
import { useState, useEffect } from "react";
import loginService from "./services/login";
import LoginForm from "./components/Login";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

// TODO: refactor all components into separate files
const Footer = () => {
    const footerStyle = {
        color: "green",
        fontStyle: "italic",
        fontSize: 16
    };

    return (
        <div style={footerStyle}>
            <br />
            <em>
                {" "}
                Note app, Department of Computer Science, University of Helsinki
                2022
            </em>
        </div>
    );
};

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return <div className="error">{message}</div>;
};

const App = () => {
    const [loginVisible, setLoginVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("a new note...");
    const [showAll, setShowAll] = useState(true);
    const [notestoshow, setNotesToShow] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

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
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);
    // console.log("render", notes.length, "notes");

    // when addnote is clicked
    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
            id: notes.length + 1
        };

        // post the new note to the server, then set the notes into the notes object,
        // then set the New Note to empty which links with the input field
        noteService.create(noteObject).then((returnedNote) => {
            setNotes(notes.concat(returnedNote));
            setNewNote("");
        });
        // setNotes(notes.concat(noteObject));
        // setNewNote("");
    };

    // NewNote is set after a value in input into the input field
    const handleNoteChange = (event) => {
        console.log(event.target.value);
        setNewNote(event.target.value);
    };

    // clicking on show important button triggers the ternary operator here
    // at render to make note into whatever based on showAll state is true or false by filtering
    useEffect(() => {
        setNotesToShow(
            showAll ? notes : notes.filter((note) => note.important === true)
        );
    }, [showAll, notes]);

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
            .catch((_error) => {
                console.log(`inside the error`);
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
                "loggedNoteappUser",
                JSON.stringify(user)
            );
            // need to set the token for the noteService to authenticate requests with successful login

            noteService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setErrorMessage("Wrong credentials");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const loginForm = () => {
        // display styles for toggling login form visibility
        const hideWhenVisible = { display: loginVisible ? "none" : "" };
        const showWhenVisible = { display: loginVisible ? "" : "none" };

        return (
            <div>
                <div style={hideWhenVisible}>
                    {/* button to show the login form
                     when clicked, set loginVisible to true */}

                    <button onClick={() => setLoginVisible(true)}>
                        log in
                    </button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) =>
                            setUsername(target.value)
                        }
                        handlePasswordChange={({ target }) =>
                            setPassword(target.value)
                        }
                        handleSubmit={handleLogin}
                    />
                    {/* button to set login form to not visible */}
                    <button onClick={() => setLoginVisible(false)}>
                        cancel
                    </button>
                </div>
            </div>
        );
    };
    //TODO: delete this noteForm function since we are using NoteForm component now
    // but keep the logout button inside
    const noteForm = () => (
        <div>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">save</button>
                <button
                    type="primary"
                    onClick={() => {
                        // clear the local storage to log out the user
                        window.localStorage.clear();
                        setUser("");
                    }}
                >
                    {/* logout button clears local storage and resets user state */}
                    logout
                </button>
            </form>
        </div>
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
                    <p>{user.name} logged in</p>
                    <Togglable buttonLabel="new note">
                        <NoteForm
                            onSubmit={addNote}
                            handleChange={handleNoteChange}
                            value={newNote}
                        />
                    </Togglable>
                    <button
                        type="primary"
                        onClick={() => {
                            // clear the local storage to log out the user
                            window.localStorage.clear();
                            setUser("");
                        }}
                    >
                        logout
                    </button>
                </div>
            )}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notestoshow.map((note) => (
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
