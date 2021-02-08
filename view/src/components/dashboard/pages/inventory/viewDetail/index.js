import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions  } from '@material-ui/core';


export default function SimpleDialog(props) {

    const { onClose, open, data } = props;

    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{data.brand}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
