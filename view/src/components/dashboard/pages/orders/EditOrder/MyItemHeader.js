import { Box, Grid } from "@material-ui/core"
import MyLabel from "./MyLabel"
import MyTextField from "./MyTextField"

export default function MyItemHeader(props) {
    const {data, itemNumber} = props

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <MyLabel>{`Item ${itemNumber}`}</MyLabel>
                </Box>
                <MyLabel>
                    {`Quantity: `}
                </MyLabel>
                <Box p={0}>
                    <MyTextField
                    dataObject={data}
                    fieldName="quantity"
                    />
                </Box>
            </Box>
        </div>
    )
}