
// instead of writing props.handleSubmit, props.handleUsernameChange etc.
// we can destructure the props object in the function parameter itself:
const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
                {/* label is used in forms to describe and name input fields */}
                {/* this way the screen reader can read the field's name to the user */}
                {/* using label element with input fields is always recommended */}
                <label>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        // Object destructuring the Onchange event object to get target value
                        // from the event object
                        // and set it as the new username state
                        // we could also do it without destructuring as below:
                        // onChange={(event) => setUsername(event.target.value)}
                        // e.g. onChange={({ target }) => setUsername(target.value)}
                        onChange={handleUsernameChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        // e.g. onChange={({ target }) => setPassword(target.value)}
                        onChange={handlePasswordChange}
                    />
                </label>
            </div>
            <button type="submit">login</button>
        </form>
    </div>
);

export default LoginForm;