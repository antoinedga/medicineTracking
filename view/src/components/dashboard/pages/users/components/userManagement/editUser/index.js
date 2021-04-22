import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { useDispatch } from 'react-redux'
import { Divider, Typography } from '@material-ui/core';
import constants from '../../../../../../../store/actions/actionType/admin'
import { getAllRoles } from '../../../../../../../store/actions/role.action'
import { editUserForRoles } from '../../../../../../../store/actions/userManagement'
import { useForm } from 'react-hook-form';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    typo: {
        paddingLeft: '20px',
        paddingBottom: '10px'
    }
}));


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


export default function DeleteDialog(props) {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [openAlert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)

    const [disableButton, setDisable] = React.useState(false)
    const [roles, setRoles] = React.useState([])
    const [selectFromRole, setSelectFrom] = React.useState([])
    const { register, getValues } = useForm();
    const dispatch = useDispatch();
    let rowData = props.data;

    const handleClose = () => {
        props.handleClose()
    };

    useEffect(() => {
        setOpen(props.open)
        console.log(rowData)
    })

    useEffect(() => {
        setDisable(false)
        setAlert(false)
        dispatch({ type: constants.ADMIN_LOADING })
        getAllRoles(dispatch).then(data => {
            let roles = data.content;
            dispatch({ type: constants.ADMIN_ROLES, payload: data.roles })
            let temp = roles.map(role => {
                return {
                    name: role.name,
                    path: role.path,
                    id: role._id,
                    search: role.name + ":" + role.path
                }
            })
            setSelectFrom(temp)
            if (rowData.roles.length == 0)
                setRoles([])
            else {
                let temp = rowData.roles.map(role => {
                    return role.name + ":" + role.path
                })
                setRoles(temp)
            }
        }).catch(error => {
            dispatch({ type: constants.ADMIN_ERROR })

        })
    }, [rowData])

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false)
        handleClose()
    };

    const getRolesID = () => {
        let temp = selectFromRole.filter(select => roles.includes(select.search))
        let ids = temp.map(tem => {
            console.log(temp)
            return tem.id

        })
        return ids;
    }

    const handleChange = (event) => {
        console.log(event.target.value)
        setRoles(event.target.value);
    };


    const handleDelete = (chipToDelete) => () => {
        console.log(chipToDelete)
        console.log(roles)
        let newArr = roles.filter(role => role != chipToDelete)
        setRoles(newArr)
    };

    const onSubmit = () => {
        let listOfIds = getRolesID();
        let userId = rowData._id;
        let form = {
            role: listOfIds,
            user: userId
        }
        console.log(form)

        editUserForRoles(dispatch, form)
            .then(data => {
                setAlert(true)
                setSuccess(true)
                setMessage(data.message)
                setDisable(true)
            })
            .catch(err => {

            })
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
                width: '250px',
            },
        },
        getContentAnchorEl: null,
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        }
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{"Editing Users"}</DialogTitle>
                <Divider variant={"middle"} />
                <DialogContent>
                    <div>
                        <Typography className={classes.typo}>
                            USER:  {rowData.name}
                        </Typography>
                        <Typography className={classes.typo}>
                            EMAIL:  {rowData.email}
                        </Typography>
                    </div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-chip-label">Roles</InputLabel>
                        <Select style={{ width: "500px" }}
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={roles}
                            onChange={handleChange}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} className={classes.chip} onDelete={handleDelete(value)}
                                            onMouseDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            inputRef={register}
                            MenuProps={MenuProps}
                        >
                            {selectFromRole.map((value) => (
                                <MenuItem key={value.name + ":" + value.path} value={value.name + ":" + value.path} style={getStyles(value.name + ":" + value.path, roles, theme)}>
                                    {value.name + ":" + value.path}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableButton} onClick={handleClose} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button disabled={disableButton} onClick={onSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={1500} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={success ? "success" : "error"}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}