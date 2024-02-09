import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { WarningNotification, SuccessNotification } from "./components/Notification";

// const WarningNotification = ({ msg }) => {
//     if (msg === null) {
//         return null;
//     }

//     const notificationstyle = {
//         color: "red",
//         background: "lightgrey",
//         fontSize: "20px",
//         borderStyle: "solid",
//         borderRadius: "5px",
//         padding: "10px",
//         marginBottom: "10px"
//     };

//     return <div style={notificationstyle}>{msg}</div>;
// };

// const SuccessNotification = ({ msg }) => {
//     if (msg === null) {
//         return null;
//     }

//     const notificationstyle = {
//         color: "green",
//         background: "lightgrey",
//         fontSize: "20px",
//         borderStyle: "solid",
//         borderRadius: "5px",
//         padding: "10px",
//         marginBottom: "10px"
//     };

//     return <div style={notificationstyle}>{msg}</div>;
// };

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [successNotification, setSuccessNotification] = useState(null);
    const [warningNotification, setWarningNotification] = useState(null);

    useEffect(() => {
        const getAllBlogs = async () => {
            const blogs = await blogService.getAll();
            setBlogs(blogs);
        };
        getAllBlogs();
    }, []);

    useEffect(() => {
        const loggedInUser = window.localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password
            });
            window.localStorage.setItem("loggedInUser", JSON.stringify(user));
            setUser(user);
            setSuccessNotification(`user ${user.name} logged in`);
            setTimeout(() => {
                setSuccessNotification(null);
            }, 5000);
            blogService.setToken(user.token);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setWarningNotification(`wrong username or password`);

            setTimeout(() => {
                setWarningNotification(null);
            }, 5000);
            // alert("Login failed");
            console.error(exception);
        }
    };

    const handleLogout = () => {
        setUser(null);
        window.localStorage.removeItem("loggedInUser");
    };

    const handleLoginOnChange = (event, setName) => {
        setName(event.target.value);
    };

    const handleCreateBlogs = async (event) => {
        event.preventDefault();

        try {
            const newBlog = {
                title: title,
                author: author,
                url: url
            };

            const returnedBlog = await blogService.createBlog(newBlog);
            setTitle("");
            setAuthor("");
            setUrl("");
            setBlogs(blogs.concat(returnedBlog));
            setSuccessNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
            setTimeout(() => {
                setSuccessNotification(null);
            }, 5000);
        } catch (err) {
            console.error(err);
            setWarningNotification(`new blog ${newBlog.title} by ${newBlog.author} could not be created`);
            setTimeout(() => {
                setWarningNotification(null);
            }, 5000);
        }
    };

    return user === null ? (
        <div>
            <h2>Log in to application</h2>
            <SuccessNotification msg={successNotification} />
            <WarningNotification msg={warningNotification} />
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
            <SuccessNotification msg={successNotification} />
            <WarningNotification msg={warningNotification} />
            <div>
                {user.name} logged in{" "}
                <button type="primary" onClick={handleLogout}>
                    logout
                </button>
            </div>

            <br />
            <h2>create new</h2>
            <form onSubmit={handleCreateBlogs}>
                <div>
                    title:
                    <input
                        value={title}
                        onChange={(event) => {
                            handleLoginOnChange(event, setTitle);
                        }}
                        type="text"
                        name="title"
                    />
                </div>

                <div>
                    author:
                    <input
                        value={author}
                        onChange={(event) => {
                            handleLoginOnChange(event, setAuthor);
                        }}
                        type="text"
                        name="author"
                    />
                </div>

                <div>
                    url:
                    <input
                        value={url}
                        onChange={(event) => {
                            handleLoginOnChange(event, setUrl);
                        }}
                        type="text"
                        name="url"
                    />
                </div>

                <button type="submit">create</button>
            </form>
            <div>
                {blogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default App;
