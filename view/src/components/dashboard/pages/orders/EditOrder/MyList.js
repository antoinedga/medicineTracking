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
  const {dataObject,fieldName,listItem, addObject} = props;
  const [list, setList] = useState([]);
  const [render, setRender] = useState(false);
  
  useEffect(() => {
    if (dataObject?.[fieldName] !== undefined)
      setList(dataObject?.[fieldName]);
      console.log("xx",dataObject?.[fieldName]);
  }, [dataObject, fieldName]);

  function handleDelete(index) {
    let newItems = list.filter((item, idx) => idx !== index);
    setList(newItems);
    dataObject[fieldName] = newItems;
  }

  function handleAdd() {
    const newItems = list.concat(addObject());
    console.log("add",newItems,addObject())
    setList([...list,addObject()]);
    dataObject[fieldName] = newItems;
    setRender(!render)
  }
  return (
      <List className={classes.root}>
        {!console.log("list",list) && list.map((item, index) => (
                listItem(item)
        ))}
        {addObject &&<IconButton
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