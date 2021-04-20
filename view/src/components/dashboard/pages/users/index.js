import React from 'react';
import { Grid } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import UserManagement from './components/userManagement'
import RoleManagement from './components/RoleManagement'
import InviteBtn from './components/Invite/'
import CreateRole from './components/createRole'
import { useDispatch, useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        paddingTop: 10
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    buttonFont: {
        fontSize: '.725rem',
        textAlign: "center",
        '@media (min-width:600px)': {
            fontSize: '.650rem',
        },

        margin: theme.spacing(1),
        height: '2.2rem'
    },
    buttonRow: {
        marginBottom: 10,
    },
}));


export default function Users(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.admin.loading)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <h3>User Management</h3>
            <Grid container
                direction="row"
                alignItems="center"
                justify="flex-start"
                padding={2}
                className={classes.buttonRow}
            >
                <Grid container item>
                    <Grid item xs={2}>
                        <InviteBtn />
                    </Grid>
                    <Grid item xs={2}>
                        <Button className={classes.buttonFont} variant="outlined" color="primary" onClick={(event) => setValue(3)}>New Roles</Button>
                    </Grid>
                </Grid>
            </Grid>
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Users" {...a11yProps(0)} />
                        <Tab label="Roles" {...a11yProps(1)} />
                        {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <UserManagement />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <RoleManagement />
                </TabPanel>
                {/* <TabPanel value={value} index={2}>
                    Item Three
                 </TabPanel> */}
                <TabPanel value={value} index={3}>
                    <CreateRole />
                </TabPanel>
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>

    );
}


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}