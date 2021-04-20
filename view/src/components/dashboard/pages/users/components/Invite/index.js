import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField, FormHelperText, CircularProgress, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { inviteUser } from '../../../../../../store/actions/userManagement'
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        paddingTop: 10
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    buttonFont: {
        fontSize: '.725rem',
        textAlign: "center",
        '@media (min-width:600px)': {
            fontSize: '.650rem',
        },

        margin: theme.spacing(1),
        height: '2.2rem'
    },
    buttonRow: {
        marginBottom: 10,
    },
}));


export default function InviteDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openAlert, setAlert] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(false);
    const { register, errors, handleSubmit, setError, clearErrors, getValues } = useForm({ mode: 'onTouched' });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAlertClose = () => {
        setAlert(false)
    }

    const handleOnSubmit = () => {
        let email = getValues();
        setLoading(true)
        inviteUser(email).then((data) => {
            console.log(data)
            if (data.response) {
                setLoading(false)
                setAlert(true)
                setSuccess(true)
            } else {
                setLoading(false)
                setAlert(true)
                setErrorMsg(data.message)
                setSuccess(false)
            }
        }).catch(error => {
            setErrorMsg(error.response)
            setLoading(false)
            setAlert(true)
            setSuccess(false)
        })
    }


    return (
        <>
            <Button className={classes.buttonFont} variant="outlined" color="primary" onClick={handleClickOpen}>
                Invite New User
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown={true}
                disableBackdropClick={true}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <DialogTitle id="alert-dialog-title">{"Invite New User"}</DialogTitle>
                <DialogContent>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Grid item >
                            {(loading) ? <CircularProgress /> : ""}
                        </Grid>
                    </Grid>

                    <DialogContentText id="alert-dialog-description">
                        <form noValidate autoComplete="off" onSubmit={handleSubmit(handleOnSubmit)}>
                            <TextField required label="Email to send Invite" fullWidth={true} size={'medium'}
                                label="Email Address"
                                name="email"
                                inputRef={register({
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            "Must be a Valid Email"
                                    },
                                    required: "Email Field cannot be empty"
                                })} />
                            <FormHelperText error={errors.email != undefined}>
                                {errors?.email?.message}
                            </FormHelperText>
                        </form>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleOnSubmit} color="primary" autoFocus>
                        Send Invitation
                    </Button>
                </DialogActions>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleAlertClose}>
                    {
                        (success) ? (
                            <Alert onClose={handleAlertClose} severity="success">
                                This is a success message!
                            </Alert>) : (
                            <Alert onClose={handleAlertClose} severity="error">
                                {errorMsg}
                            </Alert>)
                    }
                </Snackbar>
            </Dialog>
        </>
    );
}