import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test } from 'vitest';
import Togglable from './Togglable';

describe('<Togglable />', () => {
    // beforeEach runs before each test in this describe block
    // it sets up the testing environment by rendering the Togglable component
    // with a button label and some children content
    beforeEach(() => {
        render(
            <Togglable buttonLabel="show...">
                <div>togglable content</div>
            </Togglable>
        );
    });

    test('renders its children', () => {
        // verifies that the children content is present in the rendered output
        // screen.debug();
        screen.getByText('togglable content');
    });

    test('at start the children are not displayed', () => {
        const element = screen.getByText('togglable content');
        expect(element).not.toBeVisible();
    });

    test('after clicking the button, children are displayed', async () => {
        const user = userEvent.setup();
        const button = screen.getByText('show...');
        await user.click(button);

        const element = screen.getByText('togglable content');
        expect(element).toBeVisible();
    });

    test('toggled content can be closed', async () => {
        // screen.debug();

        const user = userEvent.setup();
        const showButton = screen.getByText('show...');
        await user.click(showButton);
        // screen.debug();

        const cancelButton = screen.getByText('cancel');
        await user.click(cancelButton);

        // screen.debug();

        const element = screen.getByText('togglable content');
        expect(element).not.toBeVisible();
    });
});
