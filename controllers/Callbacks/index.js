exports.Callback = (action) => {
    return (err,res) => {
      if (err)
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during ${action}`, 
              Content: err
            })
      else
        return res
          .status(200)
          .json({
            response: true,
            message: `Successfully completed ${action}`, 
            Content: res
          })
    }
}