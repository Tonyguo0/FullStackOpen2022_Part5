const WarningNotification = ({ msg }) => {
    if (msg === null) {
        return null;
    }
    return <div className="warning">{msg}</div>;
};

const SuccessNotification = ({ msg }) => {
    if (msg === null) {
        return null;
    }
    return <div className="success">{msg}</div>;
};

export { WarningNotification, SuccessNotification };
