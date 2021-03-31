import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core'
import Moment from 'react-moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { deleteOrder } from '../../../../../store/actions/order.action'
import { useDispatch } from 'react-redux'
import constants from '../../../../../store/actions/actionType/order'
export default function DeleteDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [openAlert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)
    const [disableButton, setDisable] = React.useState(false)

    const dispatch = useDispatch();
    let rowData = props.rowData;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.handleClose()
        setAlert(false);
    };

    const deleteOrderEvent = () => {
        setDisable(true)
        deleteOrder(dispatch, rowData._id).then(result => {
            dispatch({ type: constants.ORDER_DONE })

            if (result.response) {
                setMessage("Successfully deleted Order");
                setSuccess(true);
                setAlert(true);
            } else {
                setDisable(false)
                setMessage("Failed to Delete Order");
                setSuccess(false);
                setAlert(true);
            }
        }).catch(error => {
            setDisable(false)
            setMessage("Failed to Delete Order: " + error.response.data.message);
            setSuccess(false);
            setAlert(true);
            dispatch({ type: constants.ORDER_DONE })
        })
    }

    useEffect(() => {
        setOpen(props.open)
    })

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
                        <Typography variant="body1">
                            Order Number: {rowData.orderNumber}
                        </Typography>
                        <Typography variant="body1">
                            Created: <Moment format="MMM-D-YYYY h:mm a" >
                                {
                                    rowData.orderDate
                                }
                            </Moment>
                        </Typography>
                        <Typography variant="body1">
                            Path: {rowData.path}
                        </Typography>
                        <Typography variant="body1">
                            Status: {rowData.status}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableButton} onClick={handleClose} variant="contained" color="secondary">
                        Disagree
                    </Button>
                    <Button disabled={disableButton} onClick={deleteOrderEvent} variant="contained" color="primary">
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