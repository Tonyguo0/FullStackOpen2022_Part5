import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';
import { test } from 'vitest';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };
    // renders a React component Note with the given note prop
    // normally react components are rendered to the DOM
    // the render function from the testing library simulates this behavior in a test environment
    // without actually manipulating the real DOM
    //
    render(<Note note={note} />);

    // this prints out the current state of the virtual DOM
    // useful for debugging tests
    //
    screen.debug();

    // we can use the object screen to access the rendered component
    // we use screen's method getByText to search for an element that contains the specified text
    //
    const element = screen.getByText(
        'Component testing is done with react-testing-library'
    );

    screen.debug(element);

    // the existence of the element is verified using an vitest's expect function
    // expect generates an assertion for its argument
    // the validity can be tested using varous condition functions
    // here we use toBeDefined to check that the element is not undefined
    expect(element).toBeDefined();
});

test('clicking the button calls event handler once', async () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    // event handler is a mock function defined with Vitest
    const mockHandler = vi.fn();

    render(<Note note={note} toggleImportance={mockHandler} />);

    // A session is started to interact with the rendered component
    const user = userEvent.setup();
    // test finds the button based on the text from the rendered component
    // aka the label of the button
    // and simulates a user clicking the button
    const button = screen.getByText('make not important');
    // clicking happens with the method click of the userEvent-library
    await user.click(button);

    // verify that the mock function was called exactly once
    // the calls to the mock function are saved to the array mock.calls within the mock function object
    expect(mockHandler.mock.calls).toHaveLength(1);
});