import React, { useEffect } from "react";
import clsx from 'clsx';
import {
    Route,
    useRouteMatch,
} from "react-router-dom";

import {
    AppBar, IconButton, Divider,
    List, ListItem, ListItemIcon, ListItemText,
    Toolbar, Drawer, Typography,
    Tooltip, Grid, Select, MenuItem, FormHelperText
} from '@material-ui/core'
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PeopleIcon from '@material-ui/icons/People';
import ReceiptIcon from '@material-ui/icons/Receipt';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button'
import StorefrontIcon from '@material-ui/icons/Storefront';
import { Link } from 'react-router-dom';
import HomePage from './pages/MainPage'
import Inventory from "./pages/inventory";
import Orders from "./pages/orders";
import Locations from './pages/locations'
import Users from "./pages/users";
import NoLocationAccess from './pages/noAccessPage'
import IdleTimer from "./pages/idle-timer";
import UserMenu from "./components/userMenu"
import { useSelector, useDispatch } from 'react-redux'
import constants from "../../store/actions/actionType/inventory";
import { state } from '../../store/store'

const inventAction = require('../../store/actions/inventory.action')
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    appName: {
        marginLeft: "auto",
        marginRight: 16
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    location: {
        paddingRight: '16px'
    },
    header: {
        color: "white"
    }

}));


function Dashboard(props) {

    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    let { url } = useRouteMatch();
    const location = useSelector(state => state.inventory.location)
    const selectedLocation = useSelector(state => state.inventory.selected)


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLocationChange = (event) => {
        dispatch({ type: constants.CHANGE_LOCATION, payload: { selected: event.target.value } })
    }


    useEffect(() => {
        console.log("dashboard")
        inventAction.getAllPath(dispatch);
    }, [url])

    return (
        <>
            <IdleTimer />
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Link to="/dashboard" style={{ textDecoration: "none" }}>
                            <Button>
                                <Typography className={classes.header} variant="h6">
                                    Medicine Tracking
                            </Typography>
                            </Button>
                        </Link>
                        <div className={classes.appName}>
                            <UserMenu />
                        </div>
                    </Toolbar>
                </AppBar>
                {/*side menu on right side of the screen*/}
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>

                        <ListItem button component={Link} to="/dashboard">
                            <ListItemIcon>
                                <Tooltip title="Dashboard" arrow>
                                    <HomeIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Dashboard"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/inventory">
                            <ListItemIcon>
                                <Tooltip title="Inventory" arrow>
                                    <StorefrontIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Inventory"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/orders">
                            <ListItemIcon>
                                <Tooltip title="Order History" arrow>
                                    <ReceiptIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Order History"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/users">
                            <ListItemIcon>
                                <Tooltip title="User Management" arrow>
                                    <PeopleIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"User Management"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/locations" >
                            <ListItemIcon>
                                <Tooltip title="Location Management" arrow>
                                    <LocationOnIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Location Management"} />
                        </ListItem>

                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Grid container direction="row" justify="flex-end">
                        <Grid item className={classes.location}>
                            <FormHelperText><h3>Location: </h3></FormHelperText>
                        </Grid>
                        <Grid item xs={2} >
                            <Select
                                value={selectedLocation}
                                onChange={handleLocationChange}
                                inputProps={{ 'aria-label': 'Without label' }}
                                fullWidth={true}
                                displayEmpty={false}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300
                                        }
                                    }
                                }}
                            >
                                {
                                    location.map(loc =>
                                        <MenuItem key={loc} value={loc}>
                                            {loc}
                                        </MenuItem>
                                    )
                                }

                            </Select>
                        </Grid>
                    </Grid>

                    <Route exact path={`${url}/`} render={() => (location == "None") ? <NoLocationAccess /> : <HomePage />} />
                    <Route exact path={`${url}/inventory`} render={() => (location == "None") ? <NoLocationAccess /> : <Inventory />} />
                    <Route exact path={`${url}/orders`} render={() => (location == "None") ? <NoLocationAccess /> : <Orders />} />
                    <Route exact path={`${url}/locations`} render={() => (location == "None") ? <NoLocationAccess /> : <Locations />} />
                    <Route exact path={`${url}/users`} render={() => (location == "None") ? <NoLocationAccess /> : <Users />} />
                </main>
            </div>
        </>
    );
}

export default Dashboard;