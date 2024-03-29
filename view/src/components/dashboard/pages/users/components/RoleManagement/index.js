import React, { useEffect, useState } from 'react';
import { Grid, Container, List, ListItemText, Divider } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icons from '../../../../../../components/material-table-icon/index'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import constants from '../../../../../../store/actions/actionType/admin'
import { getAllRoles } from '../../../../../../store/actions/role.action'
import DeleteDialog from './deleteDialogRole'
import EditDialogRole from './editDialogRole'
import Moment from 'react-moment';

export default function RoleManagement(props) {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.admin.loading)
    const selected = useSelector(state => state.inventory.selected)
    const data = useSelector(state => state.admin.roles)
    const [deleteToggle, setDeleteView] = useState(false);
    const [rowDataDelete, setRowDataDelete] = useState({})

    const [editToggle, setEditView] = useState(false);
    const [rowDataEdit, setRowEdit] = useState({})

    useEffect(() => {
        dispatch({ type: constants.ADMIN_LOADING })
        getAllRoles(dispatch).then(data => {
            console.log(data)

            dispatch({ type: constants.ADMIN_ROLES, payload: data.content })
        }).catch(error => {
            dispatch({ type: constants.ADMIN_ERROR })

        })
    }, [selected, rowDataDelete, rowDataEdit])


    const handleOpenDelete = (row) => {
        setRowDataDelete(row)
        setDeleteView(true)
    }

    const handleDeleteClose = () => {
        setDeleteView(false)
        setRowDataDelete({})
    }

    const handleOpenEdit = (row) => {
        setRowEdit(row)
        setEditView(true)
    }

    const handleEditClose = () => {
        setRowEdit({})
        setEditView(false)
    }

    return (
        <div>
            <MaterialTable
                title="List of Roles"
                columns={[
                    { title: 'Role', field: 'name' },
                    {
                        title: 'Path', field: 'path',
                    },
                    {
                        title: 'Created', field: 'createdAt',
                        render: rowData => <Moment date={rowData.createdAt} format="MMM-D-YYYY hh:mm a" />
                    }
                ]}
                data={data}
                icons={icons}
                actions={[
                    {
                        icon: icons.Edit,
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => handleOpenEdit(rowData)
                    },
                    {
                        icon: icons.Delete,
                        tooltip: 'Delete User',
                        onClick: (event, rowData) => handleOpenDelete(rowData)
                    }
                ]}
                detailPanel={rowData => {
                    return <DetailPanel data={rowData} />
                }}
                options={{
                    actionsColumnIndex: -1,
                    search: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 15, 20, 25, 50],
                    maxBodyHeight: '50vh',
                    minBodyHeight: '50vh',
                }}
            />
            <EditDialogRole open={editToggle} handleClose={handleEditClose} rowData={rowDataEdit}></EditDialogRole>
            <DeleteDialog open={deleteToggle} handleClose={handleDeleteClose} rowData={rowDataDelete} />
        </div>
    )
}

function DetailPanel({ data }) {
    //console.log(data)
    return (
        <>
            <div style={{ height: '450px', overflow: 'auto' }}>
                <Grid container>
                    {
                        data.permissions.map((element, index) => {
                            return (
                                <>
                                    <Grid item xs={6} style={(index % 2 == 1) ? (
                                        {
                                            borderLeft: "1px solid",
                                            borderColor: "rgba(0, 0, 0, 0.12)"
                                        }
                                    ) : null}>
                                        <Container maxWidth="sm" style={{ paddingTop: '15px' }}>
                                            <Typography variant="h5">Path: {element.path}</Typography>
                                            <Typography variant="h6">Resource: {element.resource}</Typography>
                                            <Divider variant={"middle"} />
                                            <List>
                                                {element.actions.map(element => {
                                                    return (
                                                        <ListItemText primary={element.action} secondary={`Recursive: ${element.recursive}`} />
                                                    )
                                                })}
                                            </List>
                                        </Container>

                                    </Grid>
                                </>)
                        })
                    }

                </Grid>
            </div>
        </>
    )
}