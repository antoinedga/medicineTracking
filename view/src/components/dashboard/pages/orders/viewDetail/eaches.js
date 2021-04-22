import { Box, Typography } from "@material-ui/core"

export default function MyEaches({eaches}) {
    return eaches ? (
        <Box style={{ marginLeft:15}}>
            <Typography>{`Quantity: ${eaches.quantity}`}</Typography>
            <Typography>{`Unit: ${eaches.unit}`}</Typography>
            {(eaches.contains?.[0]) ? 
            <>
            <Typography>{`Contains:`}</Typography>
                {eaches.contains.map(eaches => <MyEaches eaches={eaches}/>)}
            </>
            :
            null
            }
        </Box>
    ) : null
}