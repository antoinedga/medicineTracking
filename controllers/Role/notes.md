| role            | path      | resource      | action        | possession
| --------------- | ------------- | ------------- | ------------- | -------------
| admin           |               | invitation    | read          | all
|                 |               |               | create        | all
|                 |               |               | update        | all
|                 |               |               | delate        | all
|                 |               | Products      | read          | all
|                 |               |               | create        | all
|                 |               |               | update        | all
|                 |               |               | delate        | all

{
    role: {
        resource: {
            action: {
                path:
            }
        }
    }
}

user[item][read][a][]
{
    user: {
        item: {
            read: {
                a: {
                    _permission: closed
                    b: {
                        _permission: sub
                    }
                }
            }
        }
    }
}
{
    path: a/b/c/d.x
}