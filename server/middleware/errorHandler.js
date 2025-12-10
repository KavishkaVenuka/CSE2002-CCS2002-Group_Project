export default function errorHandler(err, req, res, next) {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    // Handle Mongo duplicate key error
    if (err && err.code === 11000) {
        const dupField = err.keyValue ? Object.keys(err.keyValue)[0] : null;
        const dupValue = err.keyValue ? err.keyValue[dupField] : null;
        return res.status(400).json({
            message: dupField ? `Duplicate value for field '${dupField}'` : "Duplicate key error",
            error: err.message,
            field: dupField,
            value: dupValue
        });
    }

    // Mongoose validation errors
    if (err && err.name === 'ValidationError') {
        return res.status(400).json({
            message: "Validation error",
            error: err.message
        });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}
