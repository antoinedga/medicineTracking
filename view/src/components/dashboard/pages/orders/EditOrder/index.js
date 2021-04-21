import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { Typography, Slide, DialogContent }
    from '@material-ui/core'
import EditOrderForm from './form';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },

    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        '& > *': {
            margin: theme.spacing(2),
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function FullScreenDialog({ orderId, open, handleClose }) {
    const classes = useStyles();
    const [onSaveRef, setOnSaveRef] = useState({ onSave: () => { } })
    const [loading, setLoading] = useState(false);

    const onclose = (e) => {
        setLoading(true)
        onSaveRef.onSave()
            .then(() => {
                setLoading(false)
                handleClose()
            })
    }
    const setLoadingEvent = (boolean) => {
        setLoading(boolean)
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Edit Order
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onclose}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <EditOrderForm setLoading={setLoadingEvent} onSaveRef={onSaveRef} orderId={orderId} />
            </DialogContent>
            <Backdrop className={classes.backdrop} open={loading}>
                <p>Grabbing Data, Please Wait</p>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dialog>
    );
}