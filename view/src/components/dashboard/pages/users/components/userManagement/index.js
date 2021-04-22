import React, { useEffect, useState } from 'react';
import { Grid, Button, Menu, MenuItem } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icons from '../../../../../material-table-icon/index'
import MaterialTable from 'material-table'
import Moment from 'react-moment'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux'
import { getAllUsersByRole } from '../../../../../../store/actions/userManagement'
import constants from '../../../../../../store/actions/actionType/admin'
import EditUser from './editUser'

const useStyles = makeStyles((theme) => ({
    menuItems: {
        background: "",
        '&:hover': {
            background: "",
        },
        "&.Mui-disabled": {
            fontColor: "rgba(0, 0, 0,0.0)"
        },
    }
}));

export default function UserManagement({ }) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const [listOfUsers, setListOfUser] = React.useState([]);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [editData, setEditData] = React.useState({});

    const handleOpenEdit = (data) => {
        setEditData(data)
        setOpenEdit(true)
    }

    const handleEditClose = () => {
        setEditData({})
        setOpenEdit(false)
    }

    useEffect(() => {
        dispatch({ type: constants.ADMIN_LOADING })

        getAllUsersByRole(dispatch).then(data => {
            console.log(data.content)
            setListOfUser(data.content)
            dispatch({ type: constants.ADMIN_SUCCESS })
        }).catch(err => {
            dispatch({ type: constants.ADMIN_SUCCESS })
            console.log(err)
        })
    }, [openEdit])


    const RoleColumn = (props) => {
        const roles = props.roles
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <>
                {(roles == undefined || roles.length == 0)
                    ? (<>Not Assigned</>) : (
                        (roles.length == 1) ? (
                            <>
                                {roles[0].name}
                            </>)
                            :
                            (<>
                                <Button onClick={handleClick}>
                                    {roles[0].name + "..."}
                                </Button>
                                <Menu anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}>
                                    {roles.map(role => {
                                        return <MenuItem className={classes.menuItems} disabled>{role.name}</MenuItem>
                                    }
                                    )}
                                </Menu>
                            </>)
                    )
                }
            </>
        )
    }


    return (<>
        <div>
            <MaterialTable
                title="List of Users"
                columns={[
                    { title: 'Name', field: 'name' },
                    {
                        title: 'Email', field: 'email',
                    },
                    {
                        title: 'Roles',
                        render: rowData => <RoleColumn roles={rowData.roles} />
                    },
                    {
                        title: 'CreatedAt', field: 'createdAt',
                        render: rowData => <Moment date={rowData.createdAt} format="MMM-D-YYYY hh:mm a" />

                    }
                ]}
                data={listOfUsers}
                icons={icons}
                actions={[
                    {
                        icon: icons.Edit,
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => handleOpenEdit(rowData)
                    }
                ]}
                options={{
                    actionsColumnIndex: -1,
                    search: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 15, 20, 25, 50],
                    maxBodyHeight: '50vh',
                    minBodyHeight: '50vh',
                }}
            />
        </div>
        <EditUser open={openEdit} handleClose={handleEditClose} data={editData} />
    </>
    )
}

