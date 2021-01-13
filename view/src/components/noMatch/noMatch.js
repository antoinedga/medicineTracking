import React from 'react';
import {Grid} from '@material-ui/core'
import './noMatch.css'
import { useLocation } from 'react-router-dom'

export default function NoMatch() {

    let location = useLocation().pathname;
    return (
        <Grid container justify="flex-start" className="container-text" >
            <Grid item>
                <h1 className="big-text">404</h1>
                <p>Resource cannot be found!</p>
                <p>Cannot find resource at: {location}</p>
            </Grid>

        </Grid>
        );
}