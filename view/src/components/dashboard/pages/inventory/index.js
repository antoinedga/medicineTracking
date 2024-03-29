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
import { Grid, Backdrop, CircularProgress } from '@material-ui/core'

import constant from "../../../../store/actions/actionType/inventory";
import { getAllPath, getAllPathPrefix } from "../../../../store/actions/inventory.action";
import { state } from '../../../../store/store'

import ViewDetail from './viewDetail'
import DeleteDialog from './deleteDialog'
import ImportExcel from './importExcel'
import AddInventory from './addInventory'
import AddItem from './addItem'

import { useDispatch, useSelector } from 'react-redux'
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
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 999999999999999999999,
            color: '#fff',
        },
    }
}));

export default function Inventory(props) {

    const [openNewInv, setNewInv] = useState(false);
    const [openDelete, setDeleteOpen] = useState(false);

    const [deleteData, setDeleteData] = useState({});
    const [tableData, setTableData] = useState([])

    const [reloadToggle, setReloadToggle] = useState(false);

    const title = useSelector(state => state.inventory.selected)
    const loading = useSelector(state => state.inventory.loading)
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch()

    const refresh = () => {
        setReloadToggle(!reloadToggle)
        props.handleDashboardToggle()
    }

    const handleDeleteOpen = (rowData) => {
        setDeleteData(rowData);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteData({})
        setDeleteOpen(false);
    };

    useEffect(() => {
        dispatch({ type: constant.LOADING })
        getAllPathPrefix(dispatch).then((data) => {
            var DataSet = []
            data.forEach(path => {
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == path)
                        continue;

                    if (data[i].startsWith(path))
                        count++;
                }
                DataSet.push({
                    name: path,
                    subInv: count
                })
            })
            return DataSet
        }).then(data => {
            console.log(data)
            setTableData(data)
            console.log(tableData)
            dispatch({ type: constant.DONE })

        }).catch(err => {
            dispatch({ type: constant.DONE })

        });
    }, [title, openNewInv, openDelete, reloadToggle])

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
                        <AddInventory open={openNewInv} handleOpen={() => setNewInv(true)} handleClose={() => setNewInv(false)} refresh={refresh} />
                    </Grid>
                </Grid>
            </Grid>
            <div>
                <MaterialTable
                    columns={[
                        { title: 'Inventory Name', field: 'name', type: "string" },
                        { title: 'Sub-Inventory Count', field: 'subInv', type: "number" },
                    ]}

                    data={tableData}

                    icons={tableIcons}

                    options={{
                        exportButton: true,
                        actionsColumnIndex: -1,
                        maxBodyHeight: '50vh',
                        minBodyHeight: '50vh',
                        pageSizeOptions: [10, 15, 25, 50],
                        pageSize: 10,
                        showTitle: false
                    }}

                    actions={[

                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Delete Item',
                            onClick: (event, rowData) => {
                                console.log(rowData)
                                handleDeleteOpen(rowData);
                            }
                        }
                    ]}
                />
            </div>

            <DeleteDialog onClose={handleDeleteClose} open={openDelete} data={deleteData} refresh={refresh} />
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}