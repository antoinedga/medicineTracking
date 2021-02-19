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
    const [data, setData] = useState([{ name: 'a', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'b', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'c', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'a', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'b', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'c', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'a', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'b', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'c', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'a', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'b', surname: 'Baran', birthYear: 0, birthCity: 63 }, { name: 'c', surname: 'Baran', birthYear: 0, birthCity: 63 }])
    const { register, handleSubmit, watch, errors } = useForm();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addItem = (key, value) => {
        setOrder(prev => new Map([...prev, [key, value]]))
    }

    const upsertItem = (key, value) => {
        setOrder((prev) => new Map(prev).set(key, value));
    }

    const deleteItem = (key) => {
        setOrder((prev) => {
            const newState = new Map(prev);
            newState.delete(key);
            return newState;
        });
    }

    // HANDLES CHANNGES ON INNOPUT ON THE ROW OF THE PRODUCT,
    const handleOnChange = row => e => {
        let quantity = parseInt(e.target.value);
        let index = row.tableData.id;
        let newArr = [...data]; // copying the old datas array


        if (quantity > 0) {

            newArr[index].birthYear = quantity;
            if (order.has(index)) {
                upsertItem(index, newArr[index]);
            } else {
                addItem(index, newArr[index])
            }

            //  console.log(newArr) // replace e.target.value with whatever you want to change it to
        } else {
            newArr[index].birthYear = quantity
            deleteItem(index)
        }
        orderToArray();
        setData(newArr);

    }
    // THIS IS TO ZERO OUT THE ITEM 
    const handleZeroOutItem = itemIndex => e => {

        let newArr = [...data]; // copying the old datas array
        newArr[itemIndex].birthYear = 0; // SET THE QUANTITY TO ZERO
        setData(newArr);
        deleteItem(itemIndex)
    }

    const handleSubmitEvent = (data, e) => { console.log(data, e) };

    const orderToArray = () => {

        return [...order.values()];
    }

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
                            <Grid item xs={4} >
                                <MaterialTable icons={materialIcon}
                                    localization={{
                                        body: {
                                            emptyDataSourceMessage: "No Item added for Order"
                                        }
                                    }}
                                    columns={[
                                        {
                                            field: 'name',
                                            title: "Name",
                                            type: "string"

                                        },
                                        {
                                            field: 'quantity',
                                            title: 'Quantity',
                                            type: 'numeric'
                                            ,
                                            defaultSort: 'desc',
                                            searchable: false,

                                        }
                                    ]}
                                    data={orderToArray()}
                                    title="List of Products for Order"

                                    options={{
                                        sorting: false,
                                        search: false,
                                        paging: false,
                                        maxBodyHeight: 500,
                                        headerStyle: { position: "sticky", top: 0 }
                                    }}

                                />
                            </Grid>
                            <Grid item xs={8} style={{ height: 500, overflowY: 'auto' }}>
                                <MaterialTable icons={materialIcon}
                                    localization={{
                                        body: {
                                            emptyDataSourceMessage: "No Item added for Order",

                                        }
                                    }}


                                    columns={[
                                        {
                                            field: 'name',
                                            title: "Name",
                                            type: "string",
                                            cellStyle: { width: '25%' }
                                        },
                                        {
                                            field: 'birthYear',
                                            title: 'Quantity',
                                            render: rowData => {
                                                return < Quantity onChange={handleOnChange(rowData)} name={rowData.name} itemID={rowData.birthYear} clearItem={handleZeroOutItem(rowData.tableData.id)} quantity={rowData.birthYear} />
                                            },
                                            defaultSort: 'desc',
                                            searchable: false,
                                            cellStyle: { width: '25%' },
                                        }
                                    ]}
                                    data={data}
                                    title="List of Products"

                                    options={{
                                        sorting: true,
                                        fixedColumns: true,
                                        paging: false,
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