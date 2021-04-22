import { makeStyles, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    select: {
        paddingLeft: '5px',
    },
}));

export default function MySelect(props) {
    const classes = useStyles();
    const { dataObject, fieldName, options } = props
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (dataObject?.[fieldName] !== undefined)
            setStatus(dataObject?.[fieldName]);
    }, [dataObject, fieldName, options]);

    function handleChange(e) {
        setStatus(e.target.value);
        dataObject[fieldName] = e.target.value;
    }
    return (
        <Select
            // defaultValue={status}
            onChange={handleChange}
            className={classes.select}
            value={status}
            {...props}
        >
            {options?.map((option) => (
                <MenuItem key={option} value={option} {...props?.childProps}>{option}</MenuItem>
            ))}
        </Select>
    )
}