const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');

// notes:
// npx playwright codegen http://localhost:5173/ 
// to generate code snippets for playwright tests
// Record mode is on, can copy the locators and actions to the tests

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        // vite forwards all requests made by the frontend to the address
        // http://localhost:5173/api to the backend: http://localhost:3001/api
        // Thus, we can use the same address in the tests when we want to
        // make requests to the backend directly
        // we also made sure in playwright.config.js that the baseURL is set to
        // 'http://localhost:5173'
        // previously the await request.post('http://localhost:3001/api/testing/reset'); --- IGNORE ---
        // is now changed to:
        await request.post('/api/testing/reset');
        const newUser = {
            name: 'Tony Stark',
            username: 'Tony',
            password: 'gogotony'
        };

        await request.post('/api/users', {
            data: newUser
        });

        await page.goto('/');
    });

    test('front page can be opened', async ({ page }) => {
        const locator = page.getByText('Notes');
        await expect(locator).toBeVisible();
        await expect(
            page.getByText(
                'Note app, Department of Computer Science, University of Helsinki 2025'
            )
        ).toBeVisible();
    });

    test(`user can log in`, async ({ page }) => {
        await loginWith(page, 'Tony', 'gogotony');
        await expect(page.getByText('Tony Stark logged in')).toBeVisible();
    });

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Tony', 'gogotony');
        });

        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright');
            await expect(
                page.getByText('a note created by playwright')
            ).toBeVisible();
        });

        describe('and several notes exist', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note');
                await createNote(page, 'second note');
                await createNote(page, 'third note');
            });

            test('importance can be changed', async ({ page }) => {
                const firstNoteText = page.getByText('first note');
                const firstNoteElement = firstNoteText.locator('..');

                await firstNoteElement
                    .getByRole('button', { name: 'make not important' })
                    .click();
                await expect(firstNoteElement.getByText('make important')).toBeVisible();
            });

            test('one of those can be made non-important', async ({ page }) => {
                await page.pause();
                const otherNoteText = page.getByText('second note');
                const otherNoteElement = otherNoteText.locator('..');

                await otherNoteElement
                    .getByRole('button', { name: 'make not important' })
                    .click();

                await expect(
                    otherNoteElement.getByText('make important')
                ).toBeVisible();
            });
        });
    });

    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'Tony', 'wrongpassword');
        const errorMessage = page.getByText('Wrong credentials');
        await expect(errorMessage).toBeVisible();

        const errorDiv = page.locator('.error');
        await expect(errorDiv).toContainText('Wrong credentials');

        await expect(errorDiv).toHaveCSS('border-style', 'solid');
        await expect(errorDiv).toHaveCSS('color', 'rgb(128, 0, 0)');

        await expect(page.getByText('Tony Stark logged in')).not.toBeVisible();
    });
});
