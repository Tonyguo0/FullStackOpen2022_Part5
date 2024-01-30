import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getAllBlogs = async () => {
            const blogs = await blogService.getAll();
            setBlogs(blogs);
        };
        getAllBlogs();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password
            });

            console.log(user);
            setUser(user);
            setPassword("");
        } catch (exception) {
            alert("Login failed");
            console.error(exception);
        }
    };

    const handleLoginOnChange = (event, setName) => {
        setName(event.target.value);
    };
    return user === null ? (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={(event) => {
                            handleLoginOnChange(event, setUsername);
                        }}
                        type="text"
                        name="username"
                    />
                </div>

                <div>
                    password
                    <input
                        value={password}
                        onChange={(event) => {
                            handleLoginOnChange(event, setPassword);
                        }}
                        type="password"
                        name="password"
                    />
                </div>

                <button type="submit">login</button>
            </form>
        </div>
    ) : (
        <div>
            <h2>blogs</h2>
            <div>{user.name} logged in</div>
            <br />
            <div>
                {blogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default App;
