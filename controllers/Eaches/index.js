const terms = [
    { key: 'name', value: '7 Select Aspirin' },
    { key: 'ndc', value: '10202-416-78' },
    { key: 'supplier', value: '7-Eleven' },
    { key: 'price', value: "＄12.08" },
  ]

Product
        .aggregate([
          { $match: { identifiers: { $in: terms } } },
          {
            $addFields: {
              "num_match": {
                $size: {
                  $filter: {
                    input: "$identifiers",
                    as: "identifier",
                    cond: { $in: ["$$identifier", terms] }
                  }
                }
              },
              "match": {
                  $filter: {
                    input: "$identifiers",
                    as: "identifier",
                    cond: { $in: ["$$identifier", terms] }
                  }
              }
            }
          },
          {
            $sort: { num_match: -1 }
          }
        ])
        .then(doc => {
          console.log(JSON.stringify(doc, null,4))
          return res.status(200).json({response: false, message: `Unauthorized`, Content: doc})
        })
        .catch( err => {
            return null
        });