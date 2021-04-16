import { useEffect, useState } from "react";
import _ from 'lodash'
import { Grid, IconButton, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";


export default  function Item({ delEvent, label }) {
    return (
      <ListItem>
        <ListItemText primary={label} />
        <ListItemSecondaryAction>
          <IconButton aria-label="delete" size="small" onClick={delEvent}>
            <Delete fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };