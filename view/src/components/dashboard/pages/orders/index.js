import React from 'react';
import {Grid} from '@material-ui/core'
import PlaceOrder from './placeOrder'

export default function Orders(props) {


    return(
        <Grid container>
            <h3>Order History</h3>
            <PlaceOrder/>
        </Grid>

    );
}