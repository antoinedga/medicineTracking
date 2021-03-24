import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Snackbar, Dialog, AppBar, IconButton, Typography, Backdrop, CircularProgress, Slide } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { DialogActions, DialogContent } from '@material-ui/core';

import PublishIcon from '@material-ui/icons/Publish';
import ClearIcon from '@material-ui/icons/Clear';
import MuiAlert from '@material-ui/lab/Alert'

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
        fontSize: '.725rem',
        textAlign: "center",
        '@media (min-width:600px)': {
            fontSize: '.650rem',
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

export default function FullScreenDialog() {

    const classes = useStyles();
    const [open, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openSnackbar, setSnackBar] = React.useState(false);

    const [files, setFiles] = React.useState([]);

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel', maxFiles: 1,
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
        console.log(acceptedFiles)
        setTimeout(() => setLoading(false), 3000);
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


    return (
        <>
            <Button variant="outlined" color="primary" className={classes.buttonFont} onClick={handleClickOpen}>
                Import CSV/XLVS
            </Button>
            <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition} disableBackdropClick>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            New Inventory Upload
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleDialogClose}>
                            <CloseIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid className="container">
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <em>(Only .csv, .xlsx, and .xls files will be accepted)</em>
                        </div>
                    </Grid>
                    <div style={{ margin: 16, fontSize: 26 }}>
                        {currentFiles}
                    </div>
                    <DialogActions>
                        <Button variant="contained" onClick={clearFile} size="large" endIcon={<ClearIcon />} className={classes.cancel}>
                            Clear
                            </Button>
                        <Button variant="contained" onClick={handleSubmit} size="large" endIcon={<PublishIcon />} className={classes.submit}>
                            Submit
                            </Button>
                    </DialogActions>
                    <Snackbar open={openSnackbar} autoHideDuration={6000} >
                        <Alert onClose={() => setSnackBar(false)} severity="success">
                            Successfully removed file!
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