import React, { useEffect, useState } from 'react';
import { Grid, Divider, List, Typography, Backdrop, CircularProgress } from '@material-ui/core'
import PlaceOrder from './placeOrder'
import MaterialTable from 'material-table'
import icons from '../../../material-table-icon'
import StatusPill from './statusPills'
import { makeStyles } from '@material-ui/core/styles';
import { getOrders } from '../../../../store/actions/order.action'
import { useDispatch, useSelector } from "react-redux"
import constants from '../../../../store/actions/actionType/order';
import DeleteDialog from './deleteDialog'
import Moment from 'react-moment';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';
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
    const [deleteToggle, setDeleteView] = useState(false);
    const [rowDataDelete, setRowData] = useState({})

    useEffect(() => {
        dispatch({ type: constants.ORDER_LOADING })

        getOrders(dispatch).then((data) => {

            dispatch({ type: constants.ORDER_DONE })

        }).catch((error) => {

            dispatch({ type: constants.ORDER_DONE })

        })
    }, [selected])

    const handleOpenDelete = (row) => {
        setRowData(row)
        setDeleteView(true)
    }
    const handleDeleteClose = () => {
        setDeleteView(false)
    }

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
                            <DetailPanel logs={rowData.log} date={rowData.date} expected={rowData.expected} tracking={rowData.tracking} />
                        )
                    }}
                    options={
                        {
                            actionsColumnIndex: -1,
                            exportButton: true,
                            pageSize: 10,
                            pageSizeOptions: [10, 15, 20, 25, 50]
                        }
                    }
                    actions={[
                        {
                            icon: InfoIcon,
                            tooltip: 'View More Details',
                            onClick: (event, rowData) => handleOpenDelete(rowData)
                        },
                        {
                            icon: DeleteForeverIcon,
                            tooltip: 'Delete Order',
                            onClick: (event, rowData) => handleOpenDelete(rowData)
                        }
                    ]}

                />
            </div>
            <DeleteDialog open={deleteToggle} handleClose={handleDeleteClose} rowData={rowDataDelete} />

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
    const logs = props.logs;
    const expected = props.expected;
    const trackingNum = props.tracking;
    console.log(logs)
    return (
        <>
            <Grid container className={classes.detailPanel}>
                <Grid item xs={7} style={{ height: 300, overflow: "auto" }}>
                    {
                        logs.map(log => {
                            return (
                                <p>
                                    <Moment format="MMM-D-YYYY h:mm a" >
                                        {
                                            log.date
                                        }
                                    </Moment>
                                    {log.message}
                                </p>
                            )
                        })
                    }
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