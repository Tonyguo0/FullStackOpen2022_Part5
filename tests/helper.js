const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'log in' }).click();
    await page.getByLabel('username').fill(username);
    await page.getByLabel('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
};

export { loginWith };