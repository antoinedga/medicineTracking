exports.callback = (req, res, action, converter) => {
  return (err, doc) => {
    if (err) {
      return res
          .status(400)
          .json({
            response: false,
            message: `Error during ${action}`,
            content: err,
          });
    } else {
      return res
          .status(200)
          .json({
            response: true,
            message: `Successfully completed ${action}`,
            content: (converter) ? converter(doc): doc,
          });
    };
  };
};

exports.sendError = (req, res, error, action) => {
  if (error.hasOwnProperty('response')) {
    return res
        .status(400)
        .json(error);
  }
  return res
      .status(400)
      .json({
        response: false,
        message: `Error during ${action}`,
        content: error,
      });
};
