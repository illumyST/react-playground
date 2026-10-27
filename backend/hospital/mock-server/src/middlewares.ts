import { ErrorRequestHandler, RequestHandler } from 'express';

const notFound: RequestHandler = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 400;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'hidden' : err.stack,
  });
};

export default {
  notFound,
  errorHandler,
};
