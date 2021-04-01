

```js
// example - user defined product with eaches
{
    _id: '603440394fb2b12220dbd4da',
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
        { key: 'price', value: '$12.08' },
    ],
    eaches: 
        {
            quantity: 1,
            unit: "BOTTLE",
            contains: [
                {
                    quantity: 355,
                    unit: "mL",
                    contains: []
                }
            ]
        }
}
```

```js
// example - product definition with eaches
{
    _id: '603440394fb2b12220dbd4da',
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
        { key: 'price', value: '$12.08' },
    ],
    eaches: 
        {
            quantity: 1,
            unit: "BOTTLE",
            contains: [
                {
                    quantity: 355,
                    unit: "mL",
                    contains: []
                }
            ]
        }
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
productIdentifiers = ['name','ndc','supplier']

// create product from product identifiers

product = {
    identifiers: [
        { key: 'name', value: '7 Select Aspirin' },
        { key: 'ndc', value: '10202-416-78' },
        { key: 'supplier', value: '7-Eleven' },
    ],
}

// find or create product definition
// find or create eaches tied to product definition and increment count
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

order data
```js
{
    identifiers: [
            { key: 'name', value: '7 Select Aspirin' },
            { key: 'ndc', value: '10202-416-78' },
            { key: 'supplier', value: '7-Eleven' },
        ],
}
```

order data with prediction
```js
{
    identifiers: [
            { key: 'name', value: '7 Select Aspirin' },
            { key: 'ndc', value: '10202-416-78' },
            { key: 'supplier', value: '7-Eleven' },
        ],
    eaches: [
        { quantity: 1, unit: 'CARTON' },
        { quantity: 1, unit: 'BOTTLE' },
        { quantity: 100, unit: 'TABLET, FILM COATED' },
    ]
}
```

ask user if correct
```js
{
    identifiers: [
            { key: 'name', value: '7 Select Aspirin' },
            { key: 'ndc', value: '10202-416-78' },
            { key: 'supplier', value: '7-Eleven' },
        ],
    eaches: [
        { quantity: 1, unit: 'CARTON' },
        { quantity: 1, unit: 'BOTTLE' },
        { quantity: 100, unit: 'TABLET, FILM COATED' },
    ]
}
```

```js
"1 KIT in 1 CARTON (59779-677-22)  *  8 TABLET, FILM COATED in 1 BLISTER PACK *  8 TABLET, FILM COATED in 1 BLISTER PACK"

set = num unit in num unit
star = start
arrow = 
`1 CARTON:
    1 KIT:
        2 BLISTER PACK:
            8 TABLET, FILM COATED
`
{
    amount = 1,
    unit = 'CARTON',
    contains = [
        {
            amount = 1,
            unit = 'KIT',
            contains = [
                {
                    amount = 1,
                    unit = 'BLISTER PACK',
                    contains = [
                        {
                            amount = 8,
                            unit = 'TABLET, FILM COATED',
                            contains = [
                                
                            ]
                        }
                    ]
                },
                {
                    amount = 1,
                    unit = 'BLISTER PACK',
                    contains = [
                        {
                            amount = 8,
                            unit = 'TABLET, FILM COATED',
                            contains = [
                                
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```