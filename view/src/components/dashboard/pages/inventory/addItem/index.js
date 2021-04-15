import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Drawer, Divider, IconButton, Grid, Container } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField, Select, MenuItem, InputLabel, Snackbar, CircularProgress, Backdrop } from '@material-ui/core'
import { useForm, } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { addNewInventory } from '../../../../../store/actions/inventory.action'
import constants from "../../../../../store/actions/actionType/inventory"

const drawerWidth = 750;
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
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
    formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    buttonFont: {
        fontSize: '.725rem',
        '@media (min-width:700px)': {
            fontSize: '.5rem',
        },
        textAlign: "center",
        margin: theme.spacing(1),

        height: '2.2rem'
    }


}));


export default function AddItem() {

    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { register, handleSubmit, getValues } = useForm('onTouched');

    const [open, setOpen] = React.useState(false);
    const [openAlert, setAlertOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const location = useSelector(state => state.inventory.location);
    const loading = useSelector(state => state.inventory.add_loading);
    const errorMsg = useSelector(state => state.inventory.add_error)

    const openInventory = () => {

        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }

    }

    const onSubmit = () => {
        console.log(getValues())
        dispatch({ type: constants.ADD_LOADING })
        addNewInventory(dispatch, getValues()).then(
            (data) => {
                console.log(data.response)
                if (data.response) {
                    setAlertOpen(true)
                    setSuccess(true)
                } else {
                    setAlertOpen(true)
                    setSuccess(false)
                }
                dispatch({ type: constants.ADD_DONE })
            }
        ).catch((error) => {
            console.log(error)
        })
    }

    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" className={classes.buttonFont} onClick={openInventory}>Add Item to Inventory</Button>
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
                    <h3>Add New Item</h3>
                    <form noValidate autoComplete="off" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                    <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
                        {(success) ? (
                            <Alert onClose={() => setAlertOpen(false)} severity="success">
                                Successfully added new inventory!
                            </Alert>)
                            :
                            (
                                <Alert severity="error">
                                    {errorMsg}
                                </Alert>
                            )}
                    </Snackbar>
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Container>
            </Drawer>
        </React.Fragment>
    );
}


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}