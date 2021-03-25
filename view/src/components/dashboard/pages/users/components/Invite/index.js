import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField, FormHelperText } from '@material-ui/core'
import { useForm } from "react-hook-form";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function InviteDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [openAlert, setAlert] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
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
        setAlert(true)
        setSuccess(true)

    }


    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
                                USER ALREADY HAS AN ACCOUNT
                            </Alert>)
                    }
                </Snackbar>
            </Dialog>
        </>
    );
}