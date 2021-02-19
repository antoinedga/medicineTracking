import React from 'react'
import { TextField, Button, withWidth } from "@material-ui/core"

export default function QuantityInput(props) {

    const name = props.name;
    const itemID = props.id;
    const handleChange = props.onChange;
    const zeroOut = props.clearItem;
    const quantity = props.quantity;

    return (
        <>
            <TextField
                id={itemID}
                type="number"
                defaultValue={0}
                name={name}
                inputProps={{
                    min: 0,
                }}
                value={quantity}
                onChange={handleChange}
            />
            <Button onClick={zeroOut}>X</Button>
        </>
    );
}