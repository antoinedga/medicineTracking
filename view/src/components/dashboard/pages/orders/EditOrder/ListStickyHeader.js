{`I'm sticky ${item.key}`}
<ListItemSecondaryAction>
<IconButton
    aria-label="delete"
    size="small"
    className={classes.margin}
    onClick={() => {
    handleDelete(i);
    }}
>
    <Delete fontSize="small" />
</IconButton>
</ListItemSecondaryAction>