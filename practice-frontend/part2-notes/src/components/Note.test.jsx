import { render, screen } from '@testing-library/react';
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
    render(<Note note={note} />);

    // we can use the object screen to access the rendered component
    // we use screen's method getByText to search for an element that contains the specified text
    const element = screen.getByText(
        'Component testing is done with react-testing-library'
    );

    // the existence of the element is verified using an vitest's expect function
    // expect generates an assertion for its argument
    // the validity can be tested using varous condition functions
    // here we use toBeDefined to check that the element is not undefined
    expect(element).toBeDefined();
});
