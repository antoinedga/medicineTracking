import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";

import {useDispatch} from "react-redux"


import { FormControl, InputLabel, MenuItem, Select, Typography, Slide, DialogContent, Grid, TextField }
    from '@material-ui/core'
import { getConfig, getOrderByID } from '../../../../../store/actions/order.action';
import { set } from 'mongoose';
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



export default function FullScreenDialog({orderId}) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const { register, unregister, errors, handleSubmit, setError, clearErrors, getValues, setValue, reset,  watch} = useForm({ mode: 'onTouched' });

    const MyInput = ({index}) => {
        const [items, setItems] = React.useState([]);
        // useEffect(()=>{
        //     setItems(getValues("items"))
        // },[items])
        return (
        <div>
            {
                getValues("items").map((key, index) => {
                console.log("mapping", items)
                return (
                    <Grid item xs={9}>
                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <input {...register(`items[${index}].product`)} defaultValue={getValues(`items[${index}].product`)} />
                            </Grid>
                            <Grid item xs={6}>
                                <input {...register(`items[${index}].desired`)} defaultValue={getValues(`items[${index}].desired`)} />
                            </Grid>
                            <IconButton
                                aria-label="delete"
                                className={classes.margin}
                                onClick={() => {
                                    let _items = getValues("items").filter((item,i) => { console.log(i,index); return i != index;})

                                    unregister("items")
                                    register("items")
                                    setValue("items", _items)

                                    setItems(_items)
                                }}
                                >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                )
                })}
        </div>
        )
    }
    orderId = "60662f89a37f721134c89f51"



    useEffect(() => {
        console.log("useEffect")
        getOrderByID(dispatch,orderId)
        .then( data => {
            if (!data.response) throw data
            reset(data.content)
            Object.keys(data.content).forEach(key => {
                register(key)
            })
        })
        .then(() => {
            getConfig(dispatch,"orderStatusOptions")
            .then( data => {
                if (!data.response) throw data
                register("orderStatusOptions")
                setValue("orderStatusOptions",data.content)
            })
            .catch(err => {
                alert("config " +err.message + "\n" + err.content)
            })
        })
        .catch(err => {
            alert("order " + err.message + "\n" + err.content)
        })
    },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
    }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container xs={12}>
                            <Grid item xs={3}>
                                <label for="orderNumber">Order Number:</label>
                                <input id="orderNumber" disabled {...register("orderNumber")} defaultValue={getValues("orderNumber")} />
                                <br/>
                                <label for="user">Ordered by:</label>
                                <input id="user" disabled {...register("user.name")} defaultValue={getValues("user.name")} />
                                <br/>
                                <label for="status">Status:</label>
                                <select id="status" {...register("status", { required: true }) } defaultValue={getValues("status")}>
                                    {watch("orderStatusOptions", false) && getValues("orderStatusOptions").map(status => (<option value={status}>{`${status}`}</option>))}
                                </select>
                                <input type="submit" />
                            </Grid>
                            <Grid item xs={9}>
                                <MyInput></MyInput>
                            </Grid>
                            
                        </Grid>
                    </form>
                </DialogContent>

            </Dialog>
        </div >
    );
}