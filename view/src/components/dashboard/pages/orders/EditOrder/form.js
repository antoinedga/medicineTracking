import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import _, { truncate } from 'lodash'
import {useDispatch} from "react-redux"
import { Box, FormControl, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListSubheader, MenuItem, Select, TextField,} from '@material-ui/core'
import { getConfig, getEachesUnits, getOrderByID } from '../../../../../store/actions/order.action';
import { set } from 'mongoose';
import MyInput from './item';
import MySelect from './MySelect';
import MyTextField from './MyTextField';
import MyList from './MyList'
import { generateKey, giveKey } from './helpers';
import MyInputField from './MyInputField';
import MyItemHeader from './MyItemHeader';
import Eaches from './eaches';
import EditProduct from './EditProduct';

const useStyles = makeStyles((theme) => ({
    // list: {
    //     display: 'flex',
    //     flex: 1,
    //     overflow:"auto",
    //     flexDirection:"column"
    //   },
    // list_logs: {
    //     overflow: "auto", 
    //     display: 'flex',
    //     flex: 1,
    //     flexDirection:"column"
    //   },
    // side: {
    //     display: 'flex',
    //     flexDirection:"column", 
    // },
    // main: {
    //     position: 'absolute',
    //     width:'100%',
    //     height:'100%',
    //     display: 'flex',
    //     flexDirection:"column",
    // },
    content: {
        // position: 'absolute',
    },
    // title: {
    //     marginLeft: theme.spacing(2),
    //     flex: 1,
    // },
    // formControl: {
    //     margin: theme.spacing(1),
    //     minWidth: 120,
    // },
    // textField: {
    //     marginLeft: theme.spacing(1),
    //     marginRight: theme.spacing(1),
    // },

}));


export default function EditOrderForm({ orderId }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [orderData, setOrderData] = useState(null);
    const [orderStatusOptions,setOrderStatusOptions] = useState(null)
    const [eachesUnitsOptions,setEachesUnitsOptions] = useState(null)

    orderId = "60662f89a37f721134c89f51"

    useEffect(()=>{

    })

    const isLoaded = () => {
        return  orderData && orderStatusOptions && eachesUnitsOptions
    }
    useEffect(() => {
        console.log("useEffect")

        // get order data
        getOrderByID(dispatch,orderId)
        .then( data => {
            if (!data.response) throw data
            setOrderData(data.content)
        })
        .then(() => {
            // get status options
            getConfig(dispatch,"orderStatusOptions")
            .then( data => {
                if (!data.response) throw data
                setOrderData(data.content)
            })
            .then(() => {
                getConfig(dispatch, "orderStatusOptions")
                    .then(data => {
                        if (!data.response) throw data
                        setOrderStatusOptions(data.content)
                    })
                    .catch(err => {
                        alert("config " + err.message + "\n" + err.content)
                    })
            })
            .catch(err => {
                alert("order " + err.message + "\n" + err.content)
            })

            // get eaches unit options
            getEachesUnits(dispatch)
            .then( data => {
                if (!data.response) throw data
                setEachesUnitsOptions(data.content.map(obj=> obj.name))
                console.log(data.content.map(obj=> obj.name).sort())
            })
            .catch(err => {
                alert("config " +err.message + "\n" + err.content)
            })
        })
        .catch(err => {
            alert("order " + err.message + "\n" + err.content)
        })
    },[dispatch, orderId]);

    const onSubmit = (e) => {
        alert(JSON.stringify(orderData));
    }

    const deleteItem = (index) => {
        return (e) => {

        }
    }

    return isLoaded() && (
        <Grid className={classes.content} container>
            <Grid className={classes.side} item xs={3}>
                <List>
                    <ListItem key="orderNumber">
                        <ListItemAvatar>{`Order Number: `}</ListItemAvatar>
                        <MyTextField
                            dataObject={orderData}
                            fieldName="orderNumber"
                            InputProps={{
                                readOnly: true,
                                }}
                        />
                    </ListItem>
                    <ListItem key="name">
                        <ListItemAvatar>{`Ordered By: `}</ListItemAvatar>
                        <MyTextField
                            dataObject={orderData?.user}
                            fieldName="name"
                            InputProps={{
                                readOnly: true,
                                }}
                        />
                    </ListItem>
                    <ListItem key="orderDate">
                        <ListItemAvatar>{`Order Date: `}</ListItemAvatar>
                        <MyTextField
                            dataObject={orderData}
                            fieldName="orderDate"
                            convert={str => new Date(str).toLocaleString()}
                            convertBack={str => new Date(str)}
                            InputProps={{
                                readOnly: true,
                                }}
                        />
                    </ListItem>
                    <ListItem key="path">
                        <ListItemAvatar>{`Inventory: `}</ListItemAvatar>
                        <MyTextField
                            dataObject={orderData}
                            fieldName="path"
                            InputProps={{
                                readOnly: true,
                                }}
                        />
                    </ListItem>
                    <ListItem key="status">
                        <ListItemAvatar>{`Status: `}</ListItemAvatar>
                        <MySelect dataObject={orderData} fieldName="status" options={orderStatusOptions} />
                    </ListItem>
                </List>
                {`Logs: `}
                <MyList className={classes.list_logs} dataObject={orderData} fieldName="log"
                    addObject={()=>{return {message:'new log'}}}
                    listItem={(data,index, delEvent)=>(
                        <ListItem key={giveKey(data,"_logKey")}>
                            <MyTextField
                            dataObject={data}
                            fieldName="message"
                            multiline
                        />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="delete" size="small" onClick={delEvent}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>)}
                    />
            </Grid>
            <Grid item xs={9}>
            <MyList className={classes.list} dataObject={orderData} fieldName="items"
                    addObject={()=>{return {product: {identifiers:[],eaches:{}}}}}
                    listItem={(data, index)=>(
                        <ListItem key={giveKey(data,"_productRowKey")}>
                            <Grid container>
                                {/* <ListSubheader style={{ width: '100%' ,fontSize: '16px', padding:'0px'}}> */}
                                        <MyItemHeader data={data} itemNumber={index+1}/>
                                {/* </ListSubheader> */}
                                <Grid item xs={6}>
                                    <EditProduct 
                                        dataObject={data}
                                        fieldName='product'
                                        optionsRef={{options:eachesUnitsOptions}}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                <EditProduct 
                                        dataObject={data}
                                        fieldName='desired'
                                        optionsRef={{options:eachesUnitsOptions}}
                                        addLabel="Add Desired Product"
                                    />
                                </Grid>
                            </Grid>
                        </ListItem>
                        )}
                    />
            </Grid>
        </Grid>           
    );
}