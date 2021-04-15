exports.requireLogin = (req, res, next) => {
  if (req.auth) {
    next();
  } else {
    return res
        .status(401)
        .json({
          response: false,
          message: `Unauthorized user!`,
          content: null,
        });
  }
};
