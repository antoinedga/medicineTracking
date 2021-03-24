import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { Grid } from '@material-ui/core'

import ViewDetail from './viewDetail'
import DeleteDialog from './deleteDialog'
import ImportExcel from './importExcel'
import AddInventory from './addInventory'
import { useSelector } from 'react-redux'
const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
};

const useStyles = makeStyles((theme) => ({
    buttonRow: {
        marginBottom: 10,
    },
    root: {
        "& .MuiPaper-root": {

            boxShadow: "none !important",
            border: "2px solid rgb(69,69,69) ",
            borderBottom: "0px"
        },
        "& .MuiTableRow-root": {
            borderBottom: "2px solid rgb(69,69,69) "
        }
    }
}));

export default function Inventory(props) {


    const [openDelete, setDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [detailData, setDetailData] = useState({});
    const [openDetail, setDetailOpen] = useState(false);
    const title = useSelector(state => state.inventory.selected)
    const classes = useStyles();
    const theme = useTheme();

    const handleDetailOpen = (rowData) => {
        setDetailData(rowData);
        setDetailOpen(true);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
    };

    const handleDeleteOpen = (rowData) => {
        setDeleteData(rowData);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    return (
        <>
            <h3>Inventory</h3>
            <Grid container
                direction="row"
                alignItems="center"
                justify="flex-start"
                padding={2}
                className={classes.buttonRow}
            >
                <Grid container items>
                    <Grid items xs={2}>
                        <AddInventory />
                    </Grid>
                    <Grid items xs={2}>
                        <ImportExcel />
                    </Grid>
                </Grid>
            </Grid>
            <div className={classes.root}>
                <MaterialTable
                    title={title}
                    columns={[
                        { title: 'Item', field: 'item', type: "string" },
                        { title: 'Drug', field: 'drug' },
                        { title: 'Quantity', field: 'quantity', type: "numeric" },

                    ]}

                    data={
                        [
                            { brand: 'uwu', drug: 'uwu', quantity: 69 },
                        ]
                    }

                    icons={tableIcons}

                    options={{
                        exportButton: true,
                    }}

                    actions={[
                        {
                            icon: tableIcons.Edit,
                            tooltip: 'View Detail ',
                            onClick: (event, rowData) => {
                                handleDetailOpen(rowData);
                            }
                        },
                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Delete Item',
                            onClick: (event, rowData) => {
                                handleDeleteOpen(rowData);
                            }
                        }
                    ]}
                />
            </div>

            <ViewDetail onClose={handleDetailClose} open={openDetail} data={detailData} />

            <DeleteDialog onClose={handleDeleteClose} open={openDelete} data={deleteData} />
        </>
    );
}