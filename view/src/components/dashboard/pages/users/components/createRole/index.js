import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField, MenuItem, InputLabel, FormControl, Select, Grid, Container,
    Checkbox, FormControlLabel, List, ListItem, ListItemText, ListItemIcon, Divider,
    Card, CardHeader, Button, Typography, Switch
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux'
import { createNewRoleConfig, getSubInventory, submitCreateRole } from '../../../../../../store/actions/role.action'
import constants from '../../../../../../store/actions/actionType/admin'
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


export default function CreateRole(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const listOfPaths = useSelector(state => state.admin.paths)
    const [selected, setSelected] = React.useState("")
    const [listToSelect, setListToSelect] = React.useState([])
    const [listToConfig, setListToConfig] = React.useState([])
    const [success, setSuccess] = React.useState(false)
    const [errorMessage, setErrMessage] = React.useState("")
    const [openSnackBar, setSnackBar] = React.useState(false)
    const resource = useSelector(state => state.admin.resource)
    const actions = useSelector(state => state.admin.actions)

    const formStuff = useForm({ mode: 'onTouched' });
    const { register, errors, handleSubmit, setError, clearErrors, getValues, setValue, reset } = formStuff;
    var counter = 0;

    useEffect(() => {
        reset({ name: "", path: "" })
        dispatch({ type: constants.ADMIN_LOADING })
        createNewRoleConfig(dispatch).then(data => {
            console.log(data)
            let payload = {
                paths: data[0],
                resource: data[1],
                actions: data[2]
            }

            dispatch({ type: constants.ADMIN_CREATE_CONFIG, payload: payload })

        })
    }, [])

    useEffect(async () => {
        console.log(selected)
        let parse;
        if (selected == "") {
            parse = [];
        } else {
            parse = listOfPaths.filter((path) => {
                return path.startsWith(selected)
            })
        }
        console.log(parse)
        setListToSelect(parse)
    }, [selected])

    const onSubmit = (data, e) => {
        let form = getValues();
        console.log(JSON.stringify(form, null, 1))
        // filters the null section if leaps around the form
        form.permissions = form.permissions.filter((ele) => { return ele != null })
        console.log(JSON.stringify(form, null, 1))
        for (var i = 0; i < form.permissions.length; i++) {
            let temp = form.permissions[i];
            temp.actions = temp.actions?.filter((ele) => { return ele != null })
        }
        console.log(JSON.stringify(form, null, 1))
        dispatch({ type: constants.ADMIN_LOADING })
        submitCreateRole(dispatch, form).then(res => {
            console.log(res)
            if (res.response) {
                setSuccess(true)
                setSnackBar(true)
                setErrMessage("Successfully Created New Role(s)!")
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
                            })} />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Path</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="path"
                                    value={selected}
                                    fullWidth
                                    defaultValue=""
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
                            <TransferList list={listToSelect} setConfig={setListToConfig} configs={listToConfig} />
                        </Grid>
                        <Grid container item xs={12} style={{ maxHeight: '50vh', overflow: 'auto' }}>
                            {
                                listToConfig.map((name, index) =>
                                    configLocation(name, resource, actions, formStuff, index, listToConfig.length)
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


function configLocation(title, resource, actions, formMethod, base, length) {
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
                        actions.map((action, actionIndex) => {

                            return (
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
                                                        } else {
                                                            unregister(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)
                                                            unregister(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`)
                                                        }
                                                        console.log(e.target.checked)

                                                    }}
                                                    value={action}
                                                    type="checkBox"
                                                />
                                            }
                                            label={action}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        {
                                            (!!watch(`permissions[${resIndex + (length * base)}].actions[${actionIndex}].action`)) ? (<FormControlLabel
                                                control={<Switch defaultValue="false" />}
                                                label="Recursive"
                                                name={`permissions[${resIndex + (length * base)}].actions[${actionIndex}].recursive`}
                                                inputRef={register}

                                            />) : null
                                        }

                                    </Grid>
                                </>
                            )
                        }
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

function TransferList(props) {
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
        console.log("called")
        props.setConfig(right)
        console.log(props.configs)
    }, [right])

    useEffect(() => {
        console.log(props.list)
        setList(props.list)
        if (props.list != undefined && Object.is(props.list, list)) {
            setLeft(props.list)
        }

        if (!Object.is(props.list, list)) {
            setLeft(props.list);
            setRight([]);
            props.setConfig([])
        }
        //setLeft(props.list)
    }, [props.list])

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