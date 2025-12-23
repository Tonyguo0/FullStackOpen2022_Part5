import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteForm from './NoteForm';

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
    const createNote = vi.fn(); // mock function
    const user = userEvent.setup();

    render(<NoteForm createNote={createNote} />);

    // getByRole finds elements by their semantic role
    // here we find the textbox (input field) and the button
    // https://testing-library.com/docs/queries/byrole/
    // getAllByRole returns an array of all matching elements
    const inputs = screen.getAllByRole('textbox');
    const sendButton = screen.getByText('save');

    // inputs[0] is the first input field
    await user.clear(inputs[0]);
    await user.type(inputs[0], 'testing a form...');
    await user.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');

    // [
    //     [
    //         {
    //         content: 'testing a form...',
    //         date: '2025-12-19T14:48:50.825Z',
    //         important: true
    //         }
    //     ]
    // ]
    console.log(createNote.mock.calls);
});
