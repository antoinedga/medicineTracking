import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { FormControl, InputLabel, MenuItem, Select, Typography, Slide, DialogContent, Grid, TextField }
    from '@material-ui/core'
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

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Sound
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <Grid container spacing={2} direction="row"
                            justify="center"
                            alignItems="center">
                            <Grid xs={8}>
                                <TextField
                                    id="standard-full-width"
                                    label="Label"
                                    style={{ margin: 8 }}
                                    placeholder="Placeholder"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid xs={8}>
                                <Select
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"PENDING"}>PENDING</MenuItem>
                                    <MenuItem value={20}>COMPLETED</MenuItem>
                                    <MenuItem value={30}>DELAYED</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>

            </Dialog>
        </div >
    );
}