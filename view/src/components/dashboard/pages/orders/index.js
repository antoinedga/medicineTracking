import React, { useEffect } from 'react';
import { Grid, Divider, List, Typography, Backdrop, CircularProgress } from '@material-ui/core'
import PlaceOrder from './placeOrder'
import MaterialTable from 'material-table'
import icons from '../../../material-table-icon'
import StatusPill from './statusPills'
import { makeStyles } from '@material-ui/core/styles';
import { getOrders } from '../../../../store/actions/order.action'
import { useDispatch, useSelector } from "react-redux"
import constants from '../../../../store/actions/actionType/order';
import Moment from 'react-moment';

const useStyles = makeStyles((theme) => ({
    detailPanel: {
        height: '315px',
    },
    paper: {
        height: '90%',
        margin: '10px'
    },
    cards: {
        marginLeft: '20px',
        marginTop: '20px'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}));

export default function Orders(props) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.orders.orders)
    const loading = useSelector(state => state.orders.loading)
    const selected = useSelector(state => state.inventory.selected)
    const classes = useStyles()

    useEffect(() => {
        dispatch({ type: constants.ORDER_LOADING })

        getOrders(dispatch).then((data) => {

            dispatch({ type: constants.ORDER_DONE })

        }).catch((error) => {

            dispatch({ type: constants.ORDER_DONE })

        })
    }, [selected])

    return (
        <>
            <h3>Order History</h3>
            <Grid container fluid>
                <Grid container items>
                    <Grid items xs={1}>
                        <PlaceOrder />
                    </Grid>
                </Grid>

            </Grid>
            <div>
                <MaterialTable
                    title={`Orders for: ${selected}`}
                    columns={[
                        { title: 'Order Number', field: 'orderNumber' },
                        {
                            title: 'Order Date', field: 'orderDate',
                            render: rowData => {
                                return <Moment format="MMM-D-YYYY h:mm a" >
                                    {
                                        rowData.orderDate
                                    }
                                </Moment>
                            }
                        },
                        { title: 'Inventory', field: 'path' },
                        {
                            title: 'Num of Items', field: 'amount',
                            render: rowData => {
                                rowData.amount = rowData.items.length
                                return rowData.amount
                            }
                        },
                        {
                            title: 'Status',
                            field: 'status',
                            render: rowData => {
                                return <StatusPill status={rowData.status} />
                            }
                        },
                    ]}

                    icons={icons}
                    data={data}
                    detailPanel={rowData => {
                        return (
                            <DetailPanel date={rowData.date} expected={rowData.expected} tracking={rowData.tracking} />
                        )
                    }}
                    options={
                        {
                            exportButton: true,
                            pageSize: 10,
                            pageSizeOptions: [10, 15, 20, 25, 50]
                        }
                    }

                />
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

const DetailPanel = (props) => {
    const classes = useStyles();
    const list = props.list;
    const date = props.date;
    const expected = props.expected;
    const trackingNum = props.tracking;
    return (
        <>
            <Grid container className={classes.detailPanel}>
                <Grid item xs={7}>

                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs={4}>
                    <div className={classes.cards}>
                        <Typography gutterBottom variant="h6">
                            Order Shipped: {date}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Expected Arrival: {expected}
                        </Typography>
                        <Typography variant="h6">
                            Tracking Number: {trackingNum}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}