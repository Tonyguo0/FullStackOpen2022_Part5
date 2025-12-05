import { useState, useImperativeHandle, forwardRef } from "react";

// remember it's props.children to pass components as props
// and they're just destructured here
const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? " none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    // the component uses useImperativeHandle to expose the toggleVisiblity function
    // to parent components via the ref prop
    useImperativeHandle(ref, () => {
        return { toggleVisibility };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {/* remember what props.children actually do */}
                {children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

export default Togglable;
