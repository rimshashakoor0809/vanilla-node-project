export const globalErrorHandler = (error, req, res, next) => {

  console.log("Global Error Handler: ", error);
  const statusCode = error.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // avoid sending headers twice
  if (res.headersSent) {
    return next(error);
  }

  // Programming errors: hide internal details
  if (!error.isOperational) {
    error.status = 500;
    error.message = "Something went wrong on our server";
  }

  const response = {
    success: false,
    message: error.message || 'Internal Server Error'
  }

  if (!isProd) {
    response.error = error;
    response.stack = error.stack;
  }

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response))
}