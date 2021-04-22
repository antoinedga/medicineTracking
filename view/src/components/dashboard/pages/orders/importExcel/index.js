import React, { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Snackbar, Dialog, AppBar, IconButton, Typography, Backdrop, CircularProgress, Slide } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { DialogActions, DialogContent, TextField, InputLabel, FormHelperText, FormControl, Input } from '@material-ui/core';

import PublishIcon from '@material-ui/icons/Publish';
import ClearIcon from '@material-ui/icons/Clear';
import MuiAlert from '@material-ui/lab/Alert'
import { uploadOrder } from '../../../../../store/actions/order.action'
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    submit: {
        background: 'green',
        color: 'white'
    },
    cancel: {
        background: 'red',
        color: 'white'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    buttonFont: {
        fontSize: ".500rem",
        textAlign: "center",
        '@media (max-width:600px)': {
            fontSize: '.480rem',
        },
        '@media (max-width:500px)': {
            fontSize: '.400rem',
        },
        margin: theme.spacing(1),
        height: '2.2rem'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FullScreenDialog(props) {

    const classes = useStyles();
    const [open, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openSnackbar, setSnackBar] = React.useState(false);
    const [enabled, setEnabled] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [message, setMessage] = React.useState("")
    const [orderNumber, setOrderNumber] = React.useState("")
    const dispatch = useDispatch()

    const handleClickOpen = () => {
        props.handleOpen()
    };

    const handleDialogClose = () => {
        props.handleClose();
        setFiles([])
        setOrderNumber("")
        setSnackBar(false);
        setLoading(false)
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({
        accept: '.csv', maxFiles: 1,
        onDrop: file => handleFile(file)
    });

    const clearFile = () => {

        if (acceptedFiles.length > 0) {
            setFiles([]);
            acceptedFiles.pop();
            setSnackBar(true)
        }
    }

    const handleFile = (file) => {
        setFiles(file);
    }

    const handleSubmit = () => {
        setLoading(true);
        uploadOrder(dispatch, acceptedFiles, orderNumber).then(data => {
            if (data.response) {
                setMessage(data.message)
                setLoading(false)
                setSnackBar(true)
            }
        })
    }

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 10,
        borderRadius: 2,
        borderColor: '##bfbaba',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bfbaba',
        outline: 'none',
        height: 300,
        transition: 'border .24s ease-in-out'
    };

    const activeStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const currentFiles = files.map(file => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
        </li>
    ));

    useEffect(() => {
        if (files.length > 0 && orderNumber != "") {
            setEnabled(true)
        }
        setDialogOpen(props.open)
    })


    return (
        <>
            <Button variant="outlined" color="primary" className={classes.buttonFont} onClick={handleClickOpen}>
                Import CSV/XLVS of Order
            </Button>
            <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition} disableBackdropClick>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            New Order Upload
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleDialogClose}>
                            <CloseIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid className="container">
                        <FormControl style={{ margin: 10 }} size={'medium'} required>
                            <InputLabel htmlFor="my-input">Order Number</InputLabel>
                            <Input id="my-input" defaultValue="" onChange={event => {
                                setOrderNumber(event.target.value)
                            }} aria-describedby="my-helper-text" />
                            <FormHelperText id="my-helper-text">i.e 123456</FormHelperText>
                        </FormControl>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <em>(Only .csv)</em>
                        </div>
                    </Grid>
                    <div style={{ margin: 16, fontSize: 26 }}>
                        {currentFiles}
                    </div>
                    <DialogActions>
                        <Button variant="contained" onClick={clearFile} size="large" endIcon={<ClearIcon />} className={classes.cancel}>
                            Clear
                            </Button>
                        <Button disabled={!enabled} variant="contained" onClick={handleSubmit} size="large" endIcon={<PublishIcon />} className={classes.submit}>
                            Submit
                            </Button>
                    </DialogActions>
                    <Snackbar open={openSnackbar} autoHideDuration={6000} >
                        <Alert onClose={() => setSnackBar(false)} severity="success">
                            {message}
                        </Alert>
                    </Snackbar>
                </DialogContent>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Dialog>
        </>
    );
}