import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField, MenuItem, InputLabel, FormControl, Select, Grid, Container,
    Checkbox, FormControlLabel, List, ListItem, ListItemText, ListItemIcon, Divider,
    Card, CardHeader, Button, Typography, Switch
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux'
import { createNewRoleConfig, getSubInventory, submitCreateRole, updateRole } from '../../../../../../../../store/actions/role.action'
import constants from '../../../../../../../../store/actions/actionType/admin'
import { useForm } from "react-hook-form";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        paddingTop: 10
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    formControl: {
        minWidth: 300,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    list: {
        width: 250,
        height: 230,
        //backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
}));


export default function EditRole(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const listOfPaths = useSelector(state => state.admin.paths)
    const [selected, setSelected] = React.useState("")
    const [name, setName] = React.useState("");
    const [listToSelect, setListToSelect] = React.useState([])
    const [listToConfig, setListToConfig] = React.useState([])
    const [success, setSuccess] = React.useState(false)
    const [errorMessage, setErrMessage] = React.useState("")
    const [openSnackBar, setSnackBar] = React.useState(false)
    const resource = useSelector(state => state.admin.resource)
    const actions = useSelector(state => state.admin.actions)
    const formStuff = useForm({ mode: 'onTouched' });
    const { register, errors, handleSubmit, setError, clearErrors, getValues, setValue, reset } = formStuff;
    const [data, setData] = React.useState({})
    const [length, setLength] = React.useState(0)

    const [myMap, setMyMap] = React.useState(new Map());

    useEffect(() => {
        setData(props.rowData)
        dispatch({ type: constants.ADMIN_LOADING })
        createNewRoleConfig(dispatch).then(data => {
            //console.log(data)
            let payload = {
                paths: data[0],
                resource: data[1],
                actions: data[2]
            }

            dispatch({ type: constants.ADMIN_CREATE_CONFIG, payload: payload })

        }).then(() => {
            //reset({ name: data.name, path: data.path })
            setValue("name", data.name)
            setName(data.name)
            setValue("path", data.path)
            setSelected(data.path)
            let temp = getPathAndConfig(data)
            // console.log("33", temp)
            setListToConfig(temp)
            console.log(listToConfig)

        })
    }, [data])

    useEffect(async () => {
        // console.log(selected)
        let parse;
        if (selected == "") {
            parse = [];
        } else {
            parse = listOfPaths.filter((path) => {
                return path.startsWith(selected)
            })
        }
        //console.log(parse)
        setListToSelect(parse)
        initializeChecked(data)
    }, [selected])


    const initializeChecked = (data) => {
        //console.log(data)
        data?.permissions?.forEach(perm => {
            perm.actions.forEach(act => {
                updateMap(perm.resource, act.action, perm.path)
                let action = act.action;
                let resIndex = resource.indexOf(perm.resource)
                let res = perm.resource
                let actionIndex = actions.indexOf(act.action)
                let title = perm.path
                let base = listToConfig.indexOf(title)
                register(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)
                setValue(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`, action)
                register(`permissions[${resIndex + (length * base)}].resource`)
                setValue(`permissions[${resIndex + (length * base)}].resource`, res)
                register(`permissions[${resIndex + (length * base)}].path`)
                setValue(`permissions[${resIndex + (length * base)}].path`, title)

                if (act.recursive) {
                    register(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`)
                    setValue(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`, true)
                    updateMap(perm.resource, act.action, perm.path, "recursive")
                }

            })
        })
    }

    const updateMap = (res, action, path, recursive = "") => {
        let str = path + res + action + recursive;
        setMyMap(new Map(myMap.set(str, true)));
    }
    const removeMap = (str) => {
        let temp = myMap;
        temp.delete(str)
        setMyMap(new Map(temp))
    }


    const onSubmit = (dataLocal, e) => {
        let form = getValues();
        form._id = data._id
        // filters the null section if leaps around the form
        form.permissions = form?.permissions.filter(Boolean)
        for (var i = 0; i < form.permissions.length; i++) {
            let temp = form.permissions[i];
            temp.actions = temp.actions.filter(Boolean)
        }
        dispatch({ type: constants.ADMIN_LOADING })
        updateRole(dispatch, form).then(res => {
            if (res.response) {
                setSuccess(true)
                setSnackBar(true)
                setErrMessage("Successfully Updated Role!")
            } else {
                setSuccess(false)
                setSnackBar(true)
                setErrMessage(res.message)
            }
            dispatch({ type: constants.ADMIN_SUCCESS })
        }).catch(error => {
            //console.log(error.response.data.message)
            setSuccess(false)
            setSnackBar(true)
            setErrMessage(error.response.data.message)
            dispatch({ type: constants.ADMIN_ERROR })

        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrMessage("")
        setSnackBar(false);
    };

    const onError = (error, e) => {
        console.log(error)
    }

    return (
        <React.Fragment>
            <Container maxWidth="md">
                <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Grid container alignItems="flex-start" spacing={1}>

                        <Grid item xs={6}>
                            <TextField required label="Name" name="name" fullWidth inputRef={register({
                                required: "Must have a name"

                            })}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setValue('name', e.target.value)
                                }}
                                value={name} />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Path</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="path"
                                    fullWidth
                                    defaultValue=""
                                    value={selected}
                                    onChange={(e) => {
                                        setSelected(e.target.value)
                                        setValue('path', e.target.value)
                                    }}
                                    inputRef={register("path", { required: true })}
                                >
                                    {listOfPaths.map(path =>
                                        <option value={path}>{path}</option>
                                    )}

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TransferList listToSelect={listToSelect} setConfig={setListToConfig} configs={listToConfig} />
                        </Grid>
                        <Grid container item xs={12} style={{ maxHeight: '50vh', overflow: 'auto' }}>
                            {listToConfig.map((name, index) =>
                                configLocation(name, resource, actions, formStuff, index, listToConfig.length, updateMap, removeMap, myMap)
                                //configLocation(title, resource, actions, formMethod, base, length, checked, setChecked) 
                            )}
                        </Grid>
                    </Grid>
                    <Button variant="outlined" color="primary" type="submit">Submit</Button>
                </form>
            </Container>

            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={(success) ? "success" : "error"}>
                    {errorMessage}
                </Alert>
            </Snackbar>


        </React.Fragment >

    );

}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function configLocation(title, resource, actions, formMethod, base, length, updateMap, removeMap, mapData) {
    const { register, errors, handleSubmit, setError, clearErrors, getValues, setValue, watch, unregister } = formMethod;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h5" style={{ padding: 10 }} >{title}</Typography>
                <Divider />
            </Grid>
            {resource.map((res, resIndex) =>
                <Grid container item xs={6}>
                    <Grid item xs={12}>
                        <Typography variant="h6">{res}</Typography>

                    </Grid>
                    {
                        actions.map((action, actionIndex) =>
                            <>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`}
                                                color="primary"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        register(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)
                                                        setValue(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`, action)
                                                        register(`permissions[${resIndex + (length * base)}].resource`)
                                                        setValue(`permissions[${resIndex + (length * base)}].resource`, res)
                                                        register(`permissions[${resIndex + (length * base)}].path`)
                                                        setValue(`permissions[${resIndex + (length * base)}].path`, title)
                                                        updateMap(res, action, title)
                                                    } else {
                                                        unregister(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)
                                                        unregister(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`)
                                                        removeMap(title + res + action)
                                                    }
                                                }}
                                                checked={mapData.has(title + res + action)}
                                                value={action}
                                                type="checkBox"
                                            />
                                        }
                                        label={action + " " + ((base * length) + ((resource.length * resIndex) + actionIndex))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {
                                        (!!watch(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)) ? (<FormControlLabel
                                            control={<Switch />}
                                            label="Recursive"
                                            name={`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`}
                                            inputRef={register}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    updateMap(res, action, title, "recursive")
                                                } else {
                                                    removeMap(title + res + action + "recursive")
                                                }
                                            }}
                                            checked={mapData.has(title + res + action + "recursive")}
                                        />) : null
                                    }

                                </Grid>
                            </>
                        )
                    }
                </Grid>
            )}

        </Grid>)
}

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

function TransferList({ listToSelect, setConfig, configs }) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [list, setList] = React.useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => {
        setConfig(right)
    }, [right])

    useEffect(() => {

        setList(listToSelect)
        if (listToSelect != undefined && Object.is(listToSelect, list)) {
            setLeft(listToSelect)
        }

        if (!Object.is(listToSelect, list)) {
            setLeft(listToSelect);
        }

        //setLeft(props.list)
    }, [listToSelect])

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
            <Grid item>{customList('Not Selected', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
            </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
            </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Selected', right)}</Grid>
        </Grid>
    );
}

function getPathAndConfig(rowData) {

    let permis = rowData.permissions;
    let permissionResource = new Set()

    permis?.forEach(element => {
        permissionResource.add(element.path)
    });


    return Array.from(permissionResource);
}