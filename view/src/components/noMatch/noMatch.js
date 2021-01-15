import React from 'react';
import {Grid} from '@material-ui/core'
import './noMatch.css'
import { useLocation, Link, useHistory } from 'react-router-dom'
import Button from "@material-ui/core/Button";




export default function NoMatch() {
    let history = useHistory();
    let location = useLocation().pathname;
    return (
        <Grid container justify="center" className="container-text" >
            <Grid item>
                <h1 className="big-text">404</h1>
                <p>Resource cannot be found!</p>
                <p>Cannot find resource at: {location}</p>
                <Grid item>
                    <Button variant="contained" color="primary"   onClick={() => {
                        history.goBack();
                    }}>
                        Return to Previous Page
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        );
}