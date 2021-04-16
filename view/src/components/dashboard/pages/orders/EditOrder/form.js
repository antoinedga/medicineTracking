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
import { Grid, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select,} from '@material-ui/core'
import { getConfig, getOrderByID } from '../../../../../store/actions/order.action';
import { set } from 'mongoose';
import MyInput from './item';
import MySelect from './MySelect';
import MyTextField from './MyTextField';
import MyList from './MyList'
import { generateKey } from './helpers';

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


export default function EditOrderForm({orderId}) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [orderData, setOrderData] = useState({});
    const [orderStatusOptions,setOrderStatusOptions] = useState([])

    orderId = "60662f89a37f721134c89f51"


    useEffect(() => {
        console.log("useEffect")
        getOrderByID(dispatch,orderId)
        .then( data => {
            if (!data.response) throw data
            setOrderData(data.content)
        })
        .then(() => {
            getConfig(dispatch,"orderStatusOptions")
            .then( data => {
                if (!data.response) throw data
                setOrderStatusOptions(data.content)
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

    

    return (
        <form onSubmit={onSubmit}>
            <Grid container>
                <Grid item xs={3}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>{`Order Number: `}</ListItemAvatar>
                            <MyTextField
                                dataObject={orderData}
                                fieldName="orderNumber"
                                InputProps={{
                                    readOnly: true,
                                  }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>{`Ordered By: `}</ListItemAvatar>
                            <MyTextField
                                dataObject={orderData?.user}
                                fieldName="name"
                                InputProps={{
                                    readOnly: true,
                                  }}
                            />
                        </ListItem>
                        <ListItem>
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
                        <ListItem>
                            <ListItemAvatar>{`Inventory: `}</ListItemAvatar>
                            <MyTextField
                                dataObject={orderData}
                                fieldName="path"
                                InputProps={{
                                    readOnly: true,
                                  }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>{`Status: `}</ListItemAvatar>
                            <MySelect dataObject={orderData} fieldName="status" options={orderStatusOptions} />
                        </ListItem>

                    </List>
                    {`Status: `}
                    <MyList dataObject={orderData} fieldName="log"
                        addObject={()=>{return {message:'asd'}}}
                        listItem={(data)=>{console.log("listItem"); return<ListItem key={generateKey("log")}>{data.message}</ListItem>}}
                        />
                </Grid>
                <Grid item xs={9}>
                    
                </Grid>
                
            </Grid>
        </form>
                
    );
}