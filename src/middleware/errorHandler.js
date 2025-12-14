import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  const isHttpError = err instanceof HttpError;
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  const message = isHttpError
    ? err.message || err.name
    : isProd
    ? "Internal Server Error"
    : err.message;

  res.status(status).json({ message });
};