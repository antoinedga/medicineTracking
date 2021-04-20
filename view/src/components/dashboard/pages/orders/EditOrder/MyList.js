import { IconButton, List, ListItemSecondaryAction, ListSubheader, makeStyles } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import { generateKey } from "./helpers";
import SubList from "./subList";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  }
}));

export default function MyList(props) {
  const classes = useStyles();
  const { dataObject, fieldName, listItem, addObject } = props;
  const [list, setList] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (dataObject?.[fieldName] !== undefined) {
      //setList(dataObject?.[fieldName]);
      console.log("xx", dataObject?.[fieldName]);
    }
  }, []);

  useEffect(() => {
    console.log(list)
  })

  function handleDelete(index) {
    let newItems = list.filter((item, idx) => idx !== index);
    setList(newItems);
    dataObject[fieldName] = newItems;
  }

  function handleAdd() {
    const newItems = addObject();
    console.log(newItems)
    setList([...list, newItems]);
    dataObject[fieldName] = list;
    console.log(list)
  }

  return (
    <List className={classes.root}>
      {(true) ? console.log(list) : null}
      {
        list.map((item) =>
          listItem(item)
        )
      }
      {addObject && <IconButton
        aria-label="add"
        size="small"
        onClick={
          handleAdd}
      >
        <Add fontSize="small" />
      </IconButton>}
    </List>
  );
}