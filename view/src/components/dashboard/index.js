import React from "react";
import clsx from 'clsx';
import {
    Route,
    Redirect, useRouteMatch,
} from "react-router-dom";

import {
    Container, AppBar, IconButton, Divider,
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
import StorefrontIcon from '@material-ui/icons/Storefront';
import {Link} from 'react-router-dom';
import Inventory from "./pages/inventory";
import Orders from "./pages/orders";
import Locations from './pages/locations'
import Users from "./pages/users";
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
    }

}));

function Dashboard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [location, setLocation] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    let { path, url } = useRouteMatch();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLocationChange= (event) => {

    }

    return (
        <>
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

                        <Typography variant="h6">
                            Mini variant drawer
                        </Typography>
                        <div className={classes.appName}>
                            USER
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
                                    <Tooltip title="Dashboard">
                                        <HomeIcon />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary={"Dashboard"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/inventory">
                            <ListItemIcon>
                                <Tooltip title="Inventory">
                                    <StorefrontIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Inventory"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/orders">
                            <ListItemIcon>
                                <Tooltip title="Order History">
                                    <ReceiptIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"Order History"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/users">
                            <ListItemIcon>
                                <Tooltip title="User Management">
                                    <PeopleIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={"User Management"} />
                        </ListItem>

                        <ListItem button component={Link} to="/dashboard/locations" >
                            <ListItemIcon>
                                <Tooltip title="Location Management">
                                    <LocationOnIcon/>
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
                                    value={location}
                                    onChange={handleLocationChange}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    fullWidth={true}
                                    >
                                    <MenuItem value={10}>Ten</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                            <Route exact path={`${url}/inventory`}>
                                <Inventory/>
                            </Route>
                            <Route exact path={`${url}/orders`}>
                                <Orders/>
                            </Route>
                            <Route exact path={`${url}/locations`}>
                                <Locations/>
                            </Route>
                            <Route exact path={`${url}/users`}>
                                <Users/>
                            </Route>

                </main>
            </div>
        </>
    );
}

export default Dashboard;