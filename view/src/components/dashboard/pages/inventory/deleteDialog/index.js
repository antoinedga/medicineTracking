import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@material-ui/core';
import { deleteInventory } from '../../../../../store/actions/inventory.action'
import { useDispatch } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function SimpleDialog(props) {

    const { onClose, open, data } = props;
    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState("")
    const [openAlert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)
    const [disableBtns, setDisableBtns] = React.useState(false)
    const dispatch = useDispatch();

    const handleClose = () => {
        onClose();
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        handleClose()
    };


    useEffect(() => {
        setState(data)
        setAlert(false)
        setSuccess(false)
    }, [open])

    const onSubmit = () => {
        setLoading(true)
        setDisableBtns(true)
        deleteInventory(dispatch, state.name)
            .then(data => {
                setLoading(false)
                console.log(data)
                setAlert(true)
                setMessage("Successfully Deleted Inventory")
                setSuccess(true)
                props.refresh()
            })
            .catch(err => {
                setLoading(false)
                setAlert(true)
                setMessage("Error while Deleting Inventory")
                setSuccess(false)
                setDisableBtns(false)
                console.log(err)
            })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{`Deleting Inventory ${state?.name}`}</DialogTitle>
            {(loading) ? (
                <>
                    <CircularProgress />
                </>
            ) : null}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete inventory: {state?.name} ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableBtns} onClick={handleClose} color="secondary">
                    No
                </Button>
                <Button disabled={disableBtns} onClick={onSubmit} color="primary">
                    Yes
                </Button>
            </DialogActions>
            <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={1550} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={success ? "success" : "error"}>
                    {message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}