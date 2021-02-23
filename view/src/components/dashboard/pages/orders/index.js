import React from 'react';
import { Grid, Divider, List, Typography } from '@material-ui/core'
import PlaceOrder from './placeOrder'
import MaterialTable from 'material-table'
import icons from '../../../material-table-icon'
import StatusPill from './statusPills'
import { makeStyles } from '@material-ui/core/styles';


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
    }
}));

export default function Orders(props) {


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
                    title="One Detail Panel Preview"
                    columns={[
                        { title: 'Order Number', field: 'OrderID' },
                        { title: 'From', field: 'from' },
                        { title: 'To', field: 'To' },
                        {
                            title: 'Status',
                            field: 'status',
                            render: rowData => {
                                return <StatusPill status={rowData.status} />
                            }
                        }
                    ]}

                    icons={icons}
                    data={[
                        { OrderID: 'Mehmet', from: 'Baran', To: "uwu", status: "Pending", date: "01/02/1999", expected: "01/03/1995", tracking: "4654-9687-das7-asda" },
                        { OrderID: 'Zerya Betül', from: 'Baran', To: "uwu", status: "Delivered", date: "01/02/1999", expected: "01/03/1995", tracking: "4654-9687-das7-asda" },
                    ]}
                    detailPanel={rowData => {
                        return (
                            <DetailPanel date={rowData.date} expected={rowData.expected} tracking={rowData.tracking} />
                        )
                    }}
                />
            </div>
        </>
    );
}
