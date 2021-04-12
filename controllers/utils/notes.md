```js
/**
 * This is how the roles are saved to the database
 * if sent like this they will work right now
 */
roleObject = {
  role: "user:/home",  // name of role. the path makes the name unique
  path: "/home",        // location of role
  permissions: [
    {
      resource: "order:/home/inv1",   // name of resource with location
      action: "read:all",             // action - all = recursive - own = only at this path
      attributes: ['*']               // what attributes this applies to
    },
    {
      resource: "order:/home/inv1",
      action: "create:own",
      attributes: ['*']
    },
    {
      resource: "order:/home",
      action:"update:all",
      attributes: ['status','log','currentLocation']
    }
  ]
}
```

```js
/**
 * Same role as above.
 * This is one option for the form you send me the roles
 * I could write a function to reformat them before saving
 */
roleObject = {
  name: "user",       // name of role
  path: "/home",  // location of role
  permissions: [
    {
      resource: "order",   // name of resource
      path: "/home/inv1",  // location of resource
      actions: [
        {
          action: "read",     // action they can take on resources at location
          recursive: true,    // if this also applies to resources at sub locations
          attributes: ['*']   // attributes of the resource that this applies to 
                              // (attributes are not being used at the moment)
        },
        { action: "create", recursive: false, attributes: ['*']}
      ]
    },
    {
      resource: "order",
      path: "/home",
      actions: [
        { action: "update", recursive: true, attributes: ['status','log','currentLocation']}
      ]
    }
  ]
}
```

```js
/**
 * Same role as above.
 * This is another option for the form you send me the roles
 * I already have a function to reformat them before saving
 */
roleObject = {
    "user:/home": {
        "order:/home/inv1":{
            "read:all": ['*'],
            "create:own": ['*']
        },
        "order:/home":{
            "update:all": ['status','log','currentLocation'],
        }
    }
}
```