import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux'

export default function DeleteDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [openAlert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)
    const [disableButton, setDisable] = React.useState(false)

    const dispatch = useDispatch();
    let rowData = props.rowData;

    const handleClose = () => {
        props.handleClose()

    };

    useEffect(() => {
        setOpen(props.open)
    })

    useEffect(() => {
        setDisable(false)
    }, [rowData])

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        handleClose()
    };


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Deleting Order"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you would like to delete:

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableButton} onClick={handleClose} variant="contained" color="secondary">
                        Disagree
                    </Button>
                    <Button disabled={disableButton} onClick={handleClose} variant="contained" color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={1750} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={success ? "success" : "error"}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}