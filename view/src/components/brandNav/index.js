import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Toolbar, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    appbar: {
        alignItems: 'center',
    },
    textColor: {
        color: 'white'

    }
});


function BrandNav() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <Typography className={classes.textColor} align="center" variant="h5">
                        Medicine Tracking
                </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default BrandNav;