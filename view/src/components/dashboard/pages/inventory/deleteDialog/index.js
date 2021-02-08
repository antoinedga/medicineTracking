import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions  } from '@material-ui/core';


export default function SimpleDialog(props) {

    const { onClose, open, data} = props;

    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete item: {} from inventory {} ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    No
                </Button>
                <Button onClick={handleClose} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
