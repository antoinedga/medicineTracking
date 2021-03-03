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

```js
roleObject['user:']['product']['actions']['path']
let roleObject = {
    role: {
        resource: {
            action: {
                path: {

                }
            }
        }
    }
}
```

```js
let path = {
    inv1: {
        can: true,
        recursive: true
        inv2: {

        }
    }
}
```

```js
let roles = [
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    resource: 'product:/inv1/inv2',
    action: 'read:own',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    resource: 'product:/inv1',
    action: 'read:any',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'admin:',
    path: '',
    resource: 'product:',
    action: 'read:any',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'admin:',
    path: '',
    resource: 'product:',
    action: 'create:any',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'admin:',
    path: '',
    resource: 'product:',
    action: 'update:any',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'admin:',
    path: '',
    resource: 'product:',
    action: 'delete:any',
    attributes: [ '*', '!price', '!_id' ]
  },
  {
    role: 'user:/mlc',
    path: '/mlc',
    resource: 'product:/mlc/Outgoing',
    action: 'read:own',
    attributes: [ '*', '!price', '!_id' ]
  }
];
```
```js
const dbRoles = [
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    permissions: [
      {
        resource: 'product:/inv1/inv2',
        action: 'read:own',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    permissions: [
      {
        resource: 'product:/inv1',
        action: 'read:any',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'admin:',
    path: '',
    permissions: [
      {
        resource: 'product:',
        action: 'read:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'create:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'update:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'delete:any',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'user:/mlc',
    path: '/mlc',
    permissions: [
      {
        resource: 'product:/mlc/Outgoing',
        action: 'read:own',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
];
```