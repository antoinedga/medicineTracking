import { Box, Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import MyList from "./MyList";
import MySelect from "./MySelect";
import MyTextField from "./MyTextField";
import Delete from "@material-ui/icons/Delete";
import MyLabel from "./MyLabel";


const useStyles = makeStyles((theme) => ({
indent: {
    marginLeft: 15
},
eachesHeading: {
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 18,
    alignItems: 'flex-start',
    justifyContent: 'center',
},
labelContainer: {
    my:'auto'
},
listItemKey: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5f6b73',
},

listItemValue: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#5f6b73',
},
}))

export default function Eaches(props) {
    const classes = useStyles();
    const {dataObject,fieldName, level, optionsRef, delEvent} = props
    const [eaches, setEaches] = useState(undefined);

    useEffect(() => {
        if (dataObject?.[fieldName] !== undefined)
        setEaches(dataObject?.[fieldName]);
    }, [dataObject, fieldName]);

    const thisDelEvent = delEvent || (() => {
        delete dataObject[fieldName]
        setEaches(undefined)
    })

    const handleAddEaches = (e) => {
        dataObject[fieldName] = {quantity:'',unit:'',contains:[]}
        setEaches(dataObject[fieldName])
    }
    
    return ((!eaches) ?
            <Button onClick={handleAddEaches}>{'Add Eaches'}</Button>
            : 
        <div style={{ marginLeft:15}}>
            <Box display="flex" justifyContent="flex-start">
                <MyLabel h={2}>Quantity:</MyLabel>
                <MyTextField 
                    dataObject={eaches}
                    fieldName="quantity"
                />
                <Box flexGrow={1}/>
                <IconButton aria-label="delete" size="small" onClick={thisDelEvent}>
                    <Delete fontSize="small" />
                </IconButton>
            </Box>
            <Box display="flex" justifyContent="flex-start">
                <MyLabel h={2}>Unit:</MyLabel>
                <MySelect 
                    dataObject={eaches}
                    fieldName="unit"
                    options={optionsRef?.options}
                />
            </Box>

            {eaches.contains &&
                <MyList dataObject={eaches} fieldName={`contains`}
                addObject={()=>{return {quantity:'',unit:'',contains:[]}}}
                listItem={(data,index,delEvent) => (
                    <Eaches dataObject={eaches.contains} fieldName={index} level={level+1} optionsRef={optionsRef} delEvent={delEvent}/>
                )}>
                </MyList>
            }
        </div>
    );
}