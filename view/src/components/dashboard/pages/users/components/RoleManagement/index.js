import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icons from '../../../../../material-table-icon/index'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import constants from '../../../../../../store/actions/actionType/admin'
import { getAllRoles } from '../../../../../../store/actions/role.action'
import DeleteDialog from './deleteDialogRole'

export default function RoleManagement(props) {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.admin.loading)
    const selected = useSelector(state => state.inventory.selected)
    const data = useSelector(state => state.admin.roles)
    const [deleteToggle, setDeleteView] = useState(false);
    const [rowDataDelete, setRowData] = useState({})

    useEffect(() => {
        console.log("ROLE is Loaded")
        dispatch({ type: constants.ADMIN_LOADING })
        getAllRoles().then(data => {
            console.log(data)

            dispatch({ type: constants.ADMIN_ROLES, payload: data.content })
        }).catch(error => {
            dispatch({ type: constants.ADMIN_ERROR })

        })
    }, [rowDataDelete])


    const handleOpenDelete = (row) => {
        setRowData(row)
        setDeleteView(true)
    }

    const handleDeleteClose = () => {
        setDeleteView(false)
        setRowData({})

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
                        title: 'Created', field: 'created',
                    }
                ]}
                data={data}
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
                    pageSizeOptions: [10, 15, 20, 25, 50]
                }}
            />
            <DeleteDialog open={deleteToggle} handleClose={handleDeleteClose} rowData={rowDataDelete} />
        </div>
    )
}

function DetailPanel({ data }) {

    return (
        <>
            <div>
                hello
            </div>
        </>
    )
}