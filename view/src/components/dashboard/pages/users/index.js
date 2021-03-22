import React from 'react';
import { Grid } from '@material-ui/core'
import InviteBtn from './components/Invite/'

export default function Users(props) {


    return (
        <Grid container>
            <h3>User Management</h3>
            <Grid item xs={12} >
                <InviteBtn />
            </Grid>
        </Grid>

    );
}