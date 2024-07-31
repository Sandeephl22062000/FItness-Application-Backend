const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) {
    return res.status(404).json({
      status: "failed",
      message: "Duplicate Key Error",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
    name: err.name,
  });
};

module.exports = globalErrorHandler;
