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

            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            alert("Login failed");
            console.error(exception);
        }
    };

    const handleLoginOnChange = (event, setName) => {
        setName(event.target.value);
    };

    return (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                username
                <input
                    value={username}
                    onChange={(event) => {
                        handleLoginOnChange(event, setUsername);
                    }}
                    type="text"
                    name="username"
                />
                password
                <input
                    value={password}
                    onChange={(event) => {
                        handleLoginOnChange(event, setPassword);
                    }}
                    type="password"
                    name="password"
                />
                <button type="submit">login</button>
            </form>
            <h2>blogs</h2>
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );
};

export default App;
