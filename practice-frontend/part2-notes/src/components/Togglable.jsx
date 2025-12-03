import { useState } from "react";

// remember it's props.children to pass components as props
// and they're just destructured here
const Togglable = ({ buttonLabel, children }) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? " none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisiblity = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisiblity}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {/* remember what props.children actually do */}
                {children}
                <button onClick={toggleVisiblity}>cancel</button>
            </div>
        </div>
    );
};

export default Togglable;
