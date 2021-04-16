import { IconButton } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import Item from "./item";


export default function SubList({ sectionId, list }) {
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      console.log("render", sectionId);
    });
  
    useEffect(() => {
      setItems(list.items);
    }, [list]);
  
    function handleDelete(index) {
      let newItems = items.filter((item, idx) => idx !== index);
      setItems(newItems);
      list.items = newItems;
    }
  
    function handleAdd(item) {
      const newItems = items.concat(item);
      setItems(newItems);
      list.items = newItems;
    }
  
    return (
      <div>
        {items.map((item, i) => (
          <Item
            key={`item-${sectionId}-${item}`}
            label={`Item ${item}`}
            delEvent={(e) => {
              handleDelete(i);
            }}
            addItem={handleAdd}
          ></Item>
        ))}
        <IconButton
          aria-label="add"
          size="small"
          onClick={() => {
            handleAdd();
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </div>
    );
  }