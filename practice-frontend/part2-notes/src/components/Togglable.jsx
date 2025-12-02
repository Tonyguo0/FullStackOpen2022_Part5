import { useState } from "react";

const Togglable = (props) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? " none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisiblity = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisiblity}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisiblity}>cancel</button>
            </div>
        </div>
    );
};

export default Togglable;
