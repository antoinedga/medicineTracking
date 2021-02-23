import React, { useState } from 'react'
import { Chip } from '@material-ui/core'
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';


export default function StatusPill(props) {

    const status = props.status;


    if (status == "Pending") {
        return (<Chip color="secondary" label="Pending" style={{
            backgroundColor: 'rgb(230, 230, 0)'
        }} icon={<TrendingFlatIcon />} />
        )
    }
    else if (status == "Delivered") {
        return (<Chip color="secondary" label="Delivered" style={{
            backgroundColor: 'Green'
        }} icon={<DoneIcon />} />
        )
    }
    else if (status == "Canceled") {
        return (<Chip color="secondary" label="Canceled" style={{
            backgroundColor: 'Red'
        }} icon={<CancelIcon />} />
        )
    }

    return (<Chip color="secondary" label="Canceled" style={{
        backgroundColor: 'Red'
    }} icon={<CancelIcon />} />
    )

}

StatusPill.prototype = {
    status: PropTypes.string.isRequired
};