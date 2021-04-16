import { MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

export default function MySelect(props) {
    const {dataObject,fieldName,options} = props
    const [status, setStatus] = useState('');

    useEffect(() => {
        setStatus(dataObject?.[fieldName]);
    }, [dataObject, fieldName]);

    function handleChange(e) {
        setStatus(e.target.value);
        dataObject[fieldName] = e.target.value;
    }
    return (
        <Select
            defaultValue={status}
            onChange={handleChange}
            value={status}
            {...props}
            >
            {options.map((option) => (
                <MenuItem value={option} {...props?.childProps}>{option}</MenuItem>
            ))}
        </Select>
    )
}