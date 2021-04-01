import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { getOrderByID } from '../../../../../store/actions/order.action'
import constants from '../../../../../store/actions/actionType/order';
import Moment from 'react-moment';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
    const [open, setOpen] = React.useState(false);
    const [dataId, setDataId] = React.useState({});
    const [dataView, setDataView] = React.useState({});
    const dispatch = useDispatch();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        props.handleClose()
    };

    useEffect(() => {
        setOpen(props.open)
        setDataId(props.data._id)
    })

    useEffect(() => {
        if (open) {
            getOrderByID(dispatch, dataId).then(result => {
                console.log(result.Content)
                setDataView(result.Content)
            }).catch(error => console.log(error.response))
            dispatch({ type: constants.ORDER_DONE })
        }
    }, [dataId])


    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title"
                scroll={"paper"}
                open={open}
                fullWidth={true}
                maxWidth={"lg"}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Order
                </DialogTitle>
                <DialogContent dividers>

                    <Typography gutterBottom>
                        Order Number: {dataView.orderNumber}
                    </Typography>
                    <Typography gutterBottom>
                        Order Date: {dataView.orderDate}
                    </Typography>
                    <Typography gutterBottom>
                        Path: {dataView.path}
                    </Typography>
                    <Typography gutterBottom>
                        Created at: <Moment format="MMM-D-YYYY h:mm a" >
                            {
                                dataView.createdAt
                            }
                        </Moment>
                    </Typography>
                    <Typography gutterBottom>
                        Last Updated at: <Moment format="MMM-D-YYYY h:mm a" >
                            {
                                dataView.updatedAt
                            }
                        </Moment>
                    </Typography>
                    <Grid container>
                        <Grid item container>
                            <Grid item xs={6}>
                                <Typography variant="h6">
                                    Products:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">
                                    Desired Products:
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container style={{ maxHeight: 300, overflow: 'auto' }}>
                            {
                                dataView.items?.map((item) => {
                                    return (
                                        <Grid item container>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    Quantity: {item.quantity}
                                                </Typography>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ListItem>
                                                    <ListItemText primary={
                                                        ListIdentifier(item.product?.identifiers)
                                                    }
                                                    />
                                                </ListItem>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ListItem>
                                                    <ListItemText primary={ListIdentifier(item.desired?.identifiers)
                                                    }
                                                    />
                                                </ListItem>
                                            </Grid>

                                        </Grid>
                                    )
                                })
                            }
                        </Grid>

                    </Grid>


                    <Typography variant="h6">
                        Logs:
                    </Typography>
                    <Divider />
                    <List dense={true} style={{ maxHeight: 200, overflow: 'auto' }}>
                        {
                            dataView.log?.map((log) => {
                                return (
                                    <ListItem key={log._id}>
                                        <ListItemText primary={log.message} secondary={<Moment format="MMM-D-YYYY h:mm a" >
                                            {
                                                log.date
                                            }
                                        </Moment>} />
                                    </ListItem>
                                )
                            })
                        }

                    </List>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function ListIdentifier(item) {
    console.log(item)
    return (
        <>
            {item?.map(key => {
                return (
                    <Typography variant="body1">
                        {key.key + " : " + key.value}
                    </Typography>
                )
            })}
        </>
    )
}