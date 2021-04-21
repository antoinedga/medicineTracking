import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

    heading1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#434B50',
    },
    heading2: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5f6b73',
    }
}))

export default function MyLabel({children, h}) {
    const classes = useStyles();
    return (
        <Box py={.5}>
            <Typography flexShrink={0} className={classes[`heading${h||1}`]}>{children}</Typography>
        </Box>
    )
}