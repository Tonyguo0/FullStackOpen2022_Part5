import { useState } from 'react';

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('a new note...');

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            date: new Date().toISOString(),
            // changed to always important true for easier testing
            // before: Math.random() < 0.5
            important: true
        });
        setNewNote('');
    };

    return (
        <div>
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={(event) => setNewNote(event.target.value)}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default NoteForm;
