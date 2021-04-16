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
import EditIcon from '@material-ui/icons/Edit';
import ImportExcel from './importExcel'
import ViewDetail from "./viewDetail"

const useStyles = makeStyles((theme) => ({
    detailPanel: {
        height: '315px',
    },
    buttonRow: {
        marginBottom: 10,
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

    const [viewDetailToggle, setViewDetail] = useState(false);
    const [rowDataView, setRowDataView] = useState({})

    const [importToggle, setImportToggle] = useState(false)

    useEffect(() => {
        dispatch({ type: constants.ORDER_LOADING })

        getOrders(dispatch).then((data) => {
            dispatch({ type: constants.ORDER_DONE })
            console.log(data.response)
        }).catch((error) => {

            dispatch({ type: constants.ORDER_DONE })

        })
    }, [selected, deleteToggle, importToggle])

    const handleOpenDelete = (row) => {
        setRowData(row)
        setDeleteView(true)
    }

    const handleDeleteClose = () => {
        setDeleteView(false)
    }

    const handleOpenDetail = (row) => {
        setRowDataView(row)
        setViewDetail(true)
    }
    const handleDetailClose = () => {
        setViewDetail(false)
    }

    const handleImportClose = () => {
        setImportToggle(false)
    }

    const handleImportOpen = () => {
        setImportToggle(true)
    }

    return (
        <>
            <h3>Order History</h3>
            <Grid container direction="row"
                alignItems="center"
                justify="flex-start"
                padding={2}
                className={classes.buttonRow}
            >
                <Grid container item >
                    <Grid item xs={2}>
                        <PlaceOrder />
                    </Grid>
                    <Grid item xs={2}>
                        <ImportExcel open={importToggle} handleOpen={handleImportOpen} handleClose={handleImportClose} />
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
                                return <Moment format="MMM-D-YYYY hh:mm a" >
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
                    // detailPanel={rowData => {
                    //     return (
                    //         <DetailPanel items={rowData.items} date={rowData.date} expected={rowData.expected} tracking={rowData.tracking} />
                    //     )
                    // }}
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
                            onClick: (event, rowData) => handleOpenDetail(rowData)
                        },
                        {
                            icon: EditIcon,
                            tooltip: 'Edit Order',
                            onClick: (event, rowData) => alert("das")
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
            <ViewDetail open={viewDetailToggle} data={rowDataView} handleClose={handleDetailClose} />
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

const DetailPanel = (props) => {
    const classes = useStyles();
    const date = props.date;
    const items = props.items;
    const expected = props.expected;
    const trackingNum = props.tracking;
    console.log(items)
    return (
        <>
            <Grid container className={classes.detailPanel}>
                <Grid item xs={7} style={{ height: 300, overflow: "auto" }}>
                    Items
                    {
                        items.map(item => {
                            return (
                                <Typography>

                                </Typography>
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