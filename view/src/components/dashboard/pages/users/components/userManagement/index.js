import React, { useEffect, useState } from 'react';
import { Grid, Button, Menu, MenuItem } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icons from '../../../../../material-table-icon/index'
import MaterialTable from 'material-table'
import Moment from 'react-moment'
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux'
import { getAllUsersByRole } from '../../../../../../store/actions/userManagement'
import EditUser from './editUser'

export default function UserManagement({ }) {

    const dispatch = useDispatch();
    const [listOfUsers, setListOfUser] = React.useState([]);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [editData, setEditData] = React.useState({});

    const handleOpenEdit = (data) => {

    }

    const handleEditClose = () => {
        setEditData({})
        setOpenEdit(false)
    }

    useEffect(() => {
        getAllUsersByRole(dispatch).then(data => {
            console.log(data.content)
            setListOfUser(data.content)
        }).catch(err => {
            console.log(err)
        })
    }, [])

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
                        icon: icons.Info,
                        tooltip: 'View Detail User',
                        onClick: (event, rowData) => alert("You saved " + rowData.name)
                    },
                    {
                        icon: icons.Edit,
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => alert("You saved " + rowData.name)
                    },
                    {
                        icon: icons.Delete,
                        tooltip: 'Delete User',
                        onClick: (event, rowData) => alert("You saved " + rowData.name)
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

const RoleColumn = (props) => {
    const roles = props.roles
    console.log(props)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        console.log(roles)
    })

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
                            <Menu>
                                {roles.map(role => {
                                    console.log(role)
                                    return <MenuItem>{role.name}</MenuItem>
                                }
                                )}
                            </Menu>
                        </>)
                )
            }
        </>
    )
}
