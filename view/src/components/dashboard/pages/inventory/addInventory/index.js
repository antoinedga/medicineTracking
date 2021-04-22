import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Drawer, Divider, IconButton, Container, FormGroup, FormHelperText } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField, Select, MenuItem, InputLabel, Snackbar, CircularProgress, Backdrop } from '@material-ui/core'
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { addNewInventory } from '../../../../../store/actions/inventory.action'
import constants from "../../../../../store/actions/actionType/inventory"

const drawerWidth = 750;
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.drawer + 1,
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
        zIndex: theme.zIndex.drawer + 2,
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


export default function SwipeableTemporaryDrawer({ open, handleOpen, handleClose, refresh }) {

    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, control, getValues, reset } = useForm('onTouched');
    const [openAlert, setAlertOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("")
    const location = useSelector(state => state.inventory.location);
    const loading = useSelector(state => state.inventory.add_loading);


    const onSubmit = () => {
        let data = getValues()
        let tempPath = data.path.split("~")[1]
        data.path = tempPath;
        dispatch({ type: constants.ADD_LOADING })
        addNewInventory(dispatch, data).then(
            (data) => {
                console.log(data.response)
                if (data.response) {
                    setAlertOpen(true)
                    setSuccess(true)
                    dispatch({ type: constants.ADD_DONE })
                    reset()
                    console.log(refresh)
                    refresh()

                } else {
                    setAlertOpen(true)
                    setSuccess(false)
                    dispatch({ type: constants.ADD_DONE })
                }
                dispatch({ type: constants.ADD_DONE })
            }
        ).catch((error) => {
            console.log(error)
            setAlertOpen(true)
            setSuccess(false)
            setErrorMsg("error on our end")
            dispatch({ type: constants.ADD_DONE })
        })
    }
    const handleButtonEvent = () => {
        if (open) {
            handleClose()
        } else {
            handleOpen()
        }
    }

    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" className={classes.buttonFont} onClick={handleButtonEvent}>Create New Inventory</Button>
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
                    <IconButton onClick={() => handleClose()}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <Divider />
                <Container >
                    <h3>Create New Inventory</h3>
                    <form noValidate autoComplete="off" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup className={classes.formControl}>
                            <InputLabel>Location to place new Inventory</InputLabel>
                            <Controller
                                control={control}
                                name="path"
                                defaultValue=""
                                rules={{
                                    validate: value => value !== "" || "Must not be empty!"
                                }}
                                as={
                                    <Select>
                                        <MenuItem key={"/"} value={"~"}>
                                            {"~/"}
                                        </MenuItem>
                                        {location.map((element) => (
                                            <MenuItem key={element} value={"~" + element}>
                                                {"~" + element}
                                            </MenuItem>
                                        ))
                                        }
                                    </Select>
                                }
                            />
                            <FormHelperText error={errors.path !== undefined}>
                                {errors?.path?.message}
                            </FormHelperText>
                        </FormGroup>
                        <FormGroup className={classes.formControl}>
                            <InputLabel>Name of New Inventory</InputLabel>

                            <TextField variant="outlined" name="name" inputRef={
                                register({
                                    required: "Inventory Must have a Name to be Valid",
                                    pattern: /^[a-zA-Z][a-zA-Z0-9]+$/
                                })
                            } />
                            <FormHelperText error={errors.name !== undefined}>
                                {errors?.name?.message}
                            </FormHelperText>
                        </FormGroup>

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