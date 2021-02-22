import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Drawer, Divider, IconButton, Grid, Container } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Form, FormInput, FormGroup, FormTextarea } from "shards-react";

const drawerWidth = 750;
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 0),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',

    }, toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 75,
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

}));


export default function SwipeableTemporaryDrawer() {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false)

    const openInventory = () => {

        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }

    }


    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" onClick={openInventory}>Add Inventory</Button>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={() => setOpen(false)}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <Divider />
                <Container >
                    <Form>
                        <FormGroup>
                            <label htmlFor="#username">Username</label>
                            <FormInput id="#username" placeholder="Username" />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="#password">Password</label>
                            <FormInput type="password" id="#password" placeholder="Password" />
                        </FormGroup>
                        <FormGroup>
                            <FormTextarea />
                        </FormGroup>
                    </Form>
                </Container>
            </Drawer>
        </React.Fragment>
    );
}
