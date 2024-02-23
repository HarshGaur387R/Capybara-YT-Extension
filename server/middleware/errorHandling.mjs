// Error handling middleware
function handleError(err, req, res, next) {
    console.error('Error: ', err);
    const status = err.statusCode || 500; // Use the status code from the error, or 500 if it doesn't exist
    return res.status(status).json({ success: false, error: { msg: err.message } });
}

export default handleError;