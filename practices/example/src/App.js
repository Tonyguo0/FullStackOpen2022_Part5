import { useState } from "react";
import Note from './components/Note'

const App = ({ notes }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Notes</h1>
      <h2>Count is:{count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        increment
      </button>
      <ul>
        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
    </div>
  );
};

export default App;
