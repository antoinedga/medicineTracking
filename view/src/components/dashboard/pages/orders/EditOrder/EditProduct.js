import { Box, Button, Grid, IconButton } from "@material-ui/core"
import MyList from "./MyList"
import MyTextField from "./MyTextField"
import Delete from '@material-ui/icons/Delete'
import Eaches from "./eaches"
import { useEffect, useState } from "react"
import { giveKey } from "./helpers"

export default function EditProduct(props) {
const {dataObject, fieldName, optionsRef, addLabel} = props

    const [product, setProduct] = useState(undefined);

    useEffect(() => {
        if (dataObject?.[fieldName] !== undefined)
        setProduct(dataObject?.[fieldName]);
    }, [dataObject, fieldName]);

    const handleAddProduct = (e) => {
        dataObject[fieldName] = {identifiers:[]}
        console.log("zz",dataObject[fieldName])
        setProduct(dataObject[fieldName])
    }
    const handleAddEaches = (e) => {
        dataObject[fieldName].eaches = {quantity:'',unit:'',contains:[]}
        setProduct(dataObject[fieldName])
    }
    return ( (!product) ?
        <Button key={giveKey(dataObject,`_add_${fieldName}`,`_add_${fieldName}`)} onClick={handleAddProduct}>{addLabel||'Add New Product'}</Button>
        :
        <Box>
            <MyList dataObject={product} fieldName={`identifiers`}
                addObject={()=>{return {key:'',value:''}}}
                listItem={(data,index,delEvent) => (
                    <Box display="flex" justifyContent="flex-start">
                        <MyTextField
                            dataObject={data}
                            fieldName="key"
                        />
                        <MyTextField
                            dataObject={data}
                            fieldName="value"
                        />
                        <Box flexGrow={1}/>
                        <IconButton aria-label="delete" size="small" onClick={delEvent}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                >
                </MyList>
                <Eaches 
                    dataObject={product}
                    fieldName="eaches"
                    level={1}
                    optionsRef={optionsRef}
                />
        </Box>
    )
}