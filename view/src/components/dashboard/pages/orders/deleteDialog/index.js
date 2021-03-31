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
        deleteOrder(dispatch, rowData._id).then(result => {
            console.log(result.response)
            dispatch({ type: constants.ORDER_DONE })
        }).catch(error => {
            console.log(error.response)
            dispatch({ type: constants.ORDER_DONE })
        })
        setAlert(true);
    }

    useEffect(() => {
        console.log(rowData)
        setOpen(props.open)
    })

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
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
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Disagree
                    </Button>
                    <Button onClick={deleteOrderEvent} variant="contained" color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000} onClose={handleAlertClose}>
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