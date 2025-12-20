import createHttpError from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof createHttpError.HttpError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  console.error('Unexpected error:', error);

  res.status(500).json({
    message: 'Server error',
  });
};
