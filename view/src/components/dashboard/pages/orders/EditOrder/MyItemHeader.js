import { Box, Grid } from "@material-ui/core"
import MyTextField from "./MyTextField"

export default function MyItemHeader(props) {
    const {data, itemNumber} = props

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex">
                <Box p={1} flexGrow={10}>
                    {`Item ${itemNumber}`}
                </Box>
                <Box p={1}>
                    {`Quantity: `}
                </Box>
                <Box p={0}>
                    <MyTextField
                    dataObject={data}
                    fieldName="quantity"
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                </Box>
            </Box>
        </div>
    )
}