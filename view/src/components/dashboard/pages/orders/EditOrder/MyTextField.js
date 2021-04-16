import { makeStyles, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    textField: {
        paddingLeft: '10px',
    },
}));

export default function MyTextField(props) {
    const classes = useStyles();
    const {dataObject,fieldName, convert= (o) => o, convertBack= (o) => o} = props
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(dataObject?.[fieldName]);
    }, [convert, dataObject, fieldName]);

    function handleChange(e) {
        const newValue = convertBack(e.target.value)
        setValue(newValue);
        dataObject[fieldName] = newValue;
    }
    return (
        <TextField
            defaultValue={convert(value)}
            onChange={handleChange}
            value={convert(value)}
            className={classes.textField}
            {...props}
            >
        </TextField>
    )
}