import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, Grid, Card, CardContent, Paper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import MaterialTable from 'material-table'
import materialIcon from '../../../../material-table-icon'
import Quantity from './quantityInput'
import { useForm } from "react-hook-form";

const json = require('./text.json');

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function FullScreenDialog() {

    const classes = useStyles();
    const [order, setOrder] = useState(new Map());
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([{ name: 'Mehmet', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'Mehmet', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'Mehmet', surname: 'Baran', birthYear: 0, birthCity: 63 }])
    const { register, handleSubmit, watch, errors } = useForm();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };




    // HANDLES CHANNGES ON INNOPUT ON THE ROW OF THE PRODUCT,
    const handleOnChange = index => e => {
        let quantity = parseInt(e.target.value);
        let newArr = [...data]; // copying the old datas array

        if (quantity > 0) {

            newArr[index].birthYear = quantity

            setOrder(order.set(index, {
                quantity: quantity,
                name: newArr[index].name,
            }));
            console.log(newArr) // replace e.target.value with whatever you want to change it to
        } else {
            newArr[index].birthYear = quantity
            setOrder(data.filter((item, itemIndex) => index !== itemIndex))
        }

        setData(newArr);

    }
    // THIS IS TO ZERO OUT THE ITEM 
    const handleZeroOutItem = itemIndex => e => {

        let newArr = [...data]; // copying the old datas array
        newArr[itemIndex].birthYear = 0; // SET THE QUANTITY TO ZERO
        console.log(newArr) // replace e.target.value with whatever you want to change it to
        setOrder(order.delete(itemIndex))
        setData(newArr);
    }

    const handleSubmitEvent = (data, e) => { console.log(data, e) };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                New Order
      </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            New Order
            </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <div>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <MaterialTable icons={materialIcon}
                                    columns={[
                                        {
                                            field: 'name',
                                            title: "Name",
                                            type: "string"

                                        },
                                        {
                                            field: 'birthYear',
                                            title: 'Quantity',
                                            type: 'numeric'
                                            ,
                                            defaultSort: 'desc',
                                            searchable: false

                                        }
                                    ]}
                                    data={() => Array.from(order.values())}
                                    title="List of Products"

                                    options={{
                                        sorting: false,
                                        search: false,
                                    }}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <MaterialTable icons={materialIcon}
                                    columns={[
                                        {
                                            field: 'name',
                                            title: "Name",
                                            type: "string"

                                        },
                                        {
                                            field: 'birthYear',
                                            title: 'Quantity',
                                            render: rowData => {
                                                return < Quantity onChange={handleOnChange(rowData.tableData.id)} name={rowData.name} itemID={rowData.birthYear} clearItem={handleZeroOutItem(rowData.tableData.id)} quantity={rowData.birthYear} />
                                            },
                                            defaultSort: 'desc',
                                            searchable: false

                                        }
                                    ]}
                                    data={data}
                                    title="List of Products"

                                    options={{
                                        sorting: true,
                                    }}

                                />
                            </Grid>
                        </Grid>
                    </div>


                </DialogContent>
            </Dialog>
        </div>
    );
}