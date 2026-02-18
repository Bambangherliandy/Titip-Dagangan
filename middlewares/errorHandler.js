module.exports = (err, req, res, next) => {
  console.log(err);

  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "Forbidden") {
    status = 403;
    message = "Forbidden";
  }

  if (err.name === "BadRequest") {
    status = 400;
    message = err.message;
  }

  if (err.name === "NotFound") {
    status = 404;
    message = err.message;
  }

  if (err.name === "Unauthorized") {
    status = 401;
    message = err.message;
  }

  res.status(status).json({ message });
};
