// cd FullStackOpen2022_Part2/practices/part2-notes
import Note from "./components/Note";
import noteService from "./services/notes";
import { useState, useEffect } from "react";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };

  
  return (
    <div style={footerStyle}>
      <br />
      <em>
        {" "}
        Note app, Department of Computer Science, University of Helsinki 2022
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
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [notestoshow, setNotesToShow] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // get all notes from url with useEffect hook
  const hooks = () => {
    // console.log("effect");
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  };
  useEffect(hooks, []);
  // console.log("render", notes.length, "notes");

  // when addnote is clicked
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
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

  //clicking on show important button triggers the ternary operator here at render to make note into whatever based on showAll state is true or false by
  useEffect(() => {
    setNotesToShow(
      showAll ? notes : notes.filter((note) => note.important === true)
    );
  }, [showAll, notes]);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    // console.log(note);
    const changedNote = { ...note, important: !note.important };
    // console.log(changedNote);
    // when we use put, it already sets the changedNote into the notes url, so when we use setNotes, if it equals to id then it should be the response data/returnedNote/changedNote else set the important value to before change
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        console.log(returnedNote);
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        console.log(`inside the error`)
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

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('logging in with', username, password)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <form onSubmit={handleLogin}>
        <div>
          username 
          <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password 
          <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notestoshow.map((note) => (
          // Note is in component folder
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit"> save</button>
      </form>

      <Footer />
    </div>
  );
};

export default App;
