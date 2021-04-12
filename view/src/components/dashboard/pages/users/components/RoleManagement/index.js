import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icons from '../../../../../material-table-icon/index'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles';



export default function RoleManagement(props) {

    useEffect(() => {

    })

    return (
        <div>
            <MaterialTable
                title="List of Roles"
                columns={[
                    { title: 'Name', field: 'orderNumber' },
                    {
                        title: 'Email', field: 'orderDate',
                    },
                    {
                        title: 'Roles', field: 'orderDate',
                    }
                ]}
                data={[{}, {}]}
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
        </div>
    )
}

function DetailPanel(props) {
    return (
        <>
            <div>
                hello
            </div>
        </>
    )
}