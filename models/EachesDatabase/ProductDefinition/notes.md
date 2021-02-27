```js
// example product
{
    _id: '603440394fb2b12220dbd4da',
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
        { key: 'price', value: '$12.08' },
    ],
    eaches: {...},
}
```

```js
// example eaches
{
    _id: '603445014fb2b12220dbd4dc',
    product_id: '603440394fb2b12220dbd4da',
    eaches: [
        { quantity: 1, unit: 'CARTON' },
        { quantity: 1, unit: 'BOTTLE' },
        { quantity: 100, unit: 'TABLET, FILM COATED' },
    ],
    score: 1,
}
```

1 BOTTLE in 1 CARTON (69842-541-01) > 100 TABLET, FILM COATED in 1 BOTTLE

```js
// example item
{
    _id: '603440394fb2b12220dbd4da',
    path: '/<inv_id_1>/<inv_id_2>/<inv_id_2>',
    product: {...},
    quantity: 5
}
```


```js
// example role
{ 
    role:'user:/<inv1>/<inv2>',
    path: '/<inv1>/<inv2>',
    permissions: [ 
        { 
            resource: 'item:/<inv1>/<inv2>',
            action: 'read:all',
            attributes: [ '*', '!_id'], 
        },
    ]
}
```

```js
// example order
{ 
    order_number: '123456789',
    path: '/<inv1>/<inv2>',
    user: '<user_id>',
    order_date: '2021-02-14T19:07:38.511',
    items: [...],
    log: [
        {
            date: '2021-02-14T20:09:22.235'
            message: 'order approved by mlc'
        },
        {
            date: '2021-02-17T09:23:21.934'
            message: 'order arrived at mlc'
        },
    ],
}
```




```js
// example - user defined product
{
    _id: '603440394fb2b12220dbd4da',
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
        { key: 'price', value: '$12.08' },
    ],
    product: '603445014fb2b12220dbd4ds',
    eaches: '603445014fb2b12220dbd4dc',
    info: '603445014fb2b12220dbd4de',
}
```

```js
// example - product
{
    _id: '603445014fb2b12220dbd4dc',
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
    ],
}
```

```js
// example - eaches
{
    _id: '603445014fb2b12220dbd4dc',
    product_id: '603445014fb2b12220dbd4dc',
    eaches: [
        { quantity: 1, unit: 'CARTON' },
        { quantity: 1, unit: 'BOTTLE' },
        { quantity: 100, unit: 'TABLET, FILM COATED' },
    ],
    score: 1,
}
```

```js
// example - additional info
{
    _id: '603445014fb2b12220dbd4de',
    eaches_id: '1',
    info: [
        { key: 'concentration', value: '325 mg/1' },
        { key: 'Substance Name', value: 'ASPIRIN' },
        { key: 'route', value: 'ORAL' },
    ]
    score: 1,
}
```
```sql
SELECT TOP 5
FROM table
WHERE table.name = value.name AND table.age = value.age
```
```js
find({ identifiers: { $in: product.identifiers } })
```

```
{ identifiers: { $in: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
        { key: 'price', value: '$12.08' },
    ] }
}
```