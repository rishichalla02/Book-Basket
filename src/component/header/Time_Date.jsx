const TimeDate = () => {
    return (
        <div>
        <h2>Current Time and Date</h2>
        <p>{new Date().toLocaleString()}</p>
        </div>
    );
}
export default TimeDate;